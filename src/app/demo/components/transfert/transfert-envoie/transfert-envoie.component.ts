import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Transfert } from 'src/app/demo/models/transfert';
import { TransfertService } from 'src/app/demo/service/transfert/transfert.service';

@Component({
    selector: 'app-transfert-envoie',
    standalone: false,
    // imports: [],
    templateUrl: './transfert-envoie.component.html',
    styleUrl: './transfert-envoie.component.scss',
    providers: [MessageService, ConfirmationService],
})
export class TransfertEnvoieComponent implements OnInit {
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
    tauxDeFrais: number = 0.05; //5%
    montantConverti: number = 0;
    tauxConversion: number = 9500; // 1 euro = 940000 franc guinéen
    isValideMontant: boolean = true;

    selectedCity: string = '';

    envoieDialog: boolean = false;
    submitted: boolean = false;
    codeRecuperer: boolean = false;
    errors: { [key: string]: string } = {};

    constructor(
        private router: Router,
        private transfertService: TransfertService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {}

    hideDialog() {
        this.envoieDialog = false;
        this.submitted = false;
    }

    onCodeRecuperer() {
        this.codeRecuperer = true;
    }

    openEnvoieDialog() {
        this.submitted = false;
        this.envoieDialog = true;
    }

    verifierMontant() {
        if (this.transfert.montant < 20) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Montant insuffisant',
                detail: 'Le montant minimum est de 20€.',
                life: 3000,
            });
            this.isValideMontant = false;
            return;
        }
        this.isValideMontant = true;
    }

    calculFraisTotal() {
        this.frais = Math.floor(this.transfert.montant * this.tauxDeFrais);
        this.total = this.transfert.montant + this.frais;
        this.calculMontantConverti();
    }

    calculMontantConverti() {
        this.montantConverti = this.transfert.montant * this.tauxConversion;
        this.transfert.montant_converti = this.montantConverti;
    }

    updateQuartier(event: any) {
        // console.log('event:', event);
        // this.transfert.quartier = event.value.value;
    }

    save() {
        this.envoieDialog = false;
        this.submitted = true;
        this.verifierMontant();
        console.log(this.isValideMontant);
        if (
            !this.transfert.quartier ||
            !this.transfert.montant ||
            !this.transfert.receveur_phone ||
            !this.transfert.receveur_prenom ||
            !this.transfert.receveur_nom ||
            !this.transfert.expediteur_phone ||
            !this.transfert.expediteur_prenom ||
            !this.transfert.expediteur_nom ||
            !this.transfert.expediteur_email
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Veuillez remplir tous les champs obligatoires.',
                life: 3000,
            });
            return;
        }

        if (this.isValideMontant) {
            this.transfertService.createTransfert(this.transfert).subscribe({
                next: (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succées',
                        detail: 'Transfert effectué avec succées',
                        life: 3000,
                    });
                },
                error: (err) => {
                    console.error('Erreur lors du transfert:', err);
                    this.errors = err.validationErrors;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Envoie du transfert a échouée. Vérifiez les champs.',
                        life: 5000,
                    });
                },
            });
        }
    }
}
