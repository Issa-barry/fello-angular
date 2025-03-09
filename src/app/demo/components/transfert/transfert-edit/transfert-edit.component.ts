import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Transfert } from 'src/app/demo/models/transfert';
import { TransfertService } from 'src/app/demo/service/transfert/transfert.service';


@Component({
  selector: 'app-transfert-edit',
  templateUrl: './transfert-edit.component.html',
  styleUrl: './transfert-edit.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class TransfertEditComponent {
  cities = [
    { name: 'Cosa / Conakry', code: 'NY' },
    { name: 'Banbeto / Conakry', code: 'RM' },
    { name: 'Foundin / Dabola', code: 'LDN' },
    { name: 'Hamdallaye / Dabola', code: 'IST' },
    { name: 'Abatoire / Mamou', code: 'PRS' },
];

transfert: Transfert = new Transfert();
total: number = 0;
frais: number = 0;
tauxDeFrais: number = 0.05; // 5%
montantConverti: number = 0;
tauxConversion: number = 9500; // 1 euro = 9500 franc guinéen
envoieDialog: boolean = false;
ticketDialog: boolean = false;
submitted: boolean = false;
loading: boolean = false;
errors: { [key: string]: string } = {};

constructor(
    private router: Router,
    private transfertService: TransfertService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
) {}

ngOnInit(): void {}


/**
 * Vérifie que le montant est valide
 */
verifierMontant(): boolean {
    if (!this.transfert.montant || this.transfert.montant < 20) {
        this.messageService.add({
            severity: 'warn',
            summary: 'Montant insuffisant',
            detail: 'Le montant minimum est de 20€.',
            life: 3000,
        });
        return false;
    }
    return true;
}

/**
 * Vérifie que tous les champs obligatoires sont remplis
 */
verifierChampsObligatoires(): boolean {
    const champsObligatoires = [
        'quartier',
        'montant',
        'receveur_phone',
        'receveur_prenom',
        'receveur_nom',
        'expediteur_phone',
        'expediteur_prenom',
        'expediteur_nom',
        'expediteur_email',
    ];

    for (const champ of champsObligatoires) {
        if (!this.transfert[champ as keyof Transfert]) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: `Le champ ${champ.replace('_', ' ')} est obligatoire.`,
                life: 3000,
            });
            return false;
        }
    }

    return true;
}

/**
 * Calcule les frais et le montant total
 */
calculFraisTotal() {
    this.frais = Math.floor(this.transfert.montant * this.tauxDeFrais);
    this.total = this.transfert.montant + this.frais;
    this.calculMontantConverti();
}

/**
 * Convertit le montant en devise cible
 */
calculMontantConverti() {
    this.montantConverti = Math.floor(this.transfert.montant * this.tauxConversion);
    this.transfert.montant_converti = this.montantConverti;
}

/**
 * Ferme la boîte de dialogue
 */
hideDialog() {
    this.envoieDialog = false;
    this.ticketDialog = false;
    this.submitted = false;
}

 /**
 * ouvrir la boîte de dialogue
 */
 openTicketDialog() {
  this.ticketDialog = true;
}

 /**
 * Ferme la boîte de dialogue du ticket d'envoie
 */
 hideTicketDialog() {
  this.ticketDialog = false;
  this.resetForm();
  this.submitted = false;
}


  /**
 * Vérifie les champs obligatoires et ouvre le dialogue si tout est valide
 */
  verifierFormulaire() {
    this.submitted = true;
    this.errors = {};

    if (!this.verifierMontant()) return;
    if (!this.verifierChampsObligatoires()) return;

    this.envoieDialog = true;
}


/**
 * Enregistre le transfert après confirmation
 */
save() {
    
    this.loading = true;

    this.transfertService.createTransfert(this.transfert).subscribe({
        next: () => {
            this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Transfert effectué avec succès',
                life: 3000,
            });
            this.loading = false;
            this.envoieDialog = false;
            this.openTicketDialog();
        },
        error: (error) => {
            console.error('Erreur lors du transfert:', error);
            this.errors = error.validationErrors;
            this.loading = false;
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'L’envoi du transfert a échoué. Vérifiez les champs.',
                life: 5000,
            });
        },
    });
}

/**
 * Réinitialise le formulaire après un transfert réussi
 */
resetForm() {
    this.transfert = new Transfert();
    this.submitted = false;
    this.montantConverti = 0;
    this.frais = 0;
    this.total = 0;
    this.errors = {};
    this.loading = false;
}
}
