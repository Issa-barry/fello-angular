import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Transfert } from 'src/app/demo/models/transfert';
import { TransfertService } from 'src/app/demo/service/transfert/transfert.service';

@Component({
    selector: 'app-transfert-envoie',
    // standalone: true,
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

    selectedCity: string = '';

    envoieDialog: boolean = false;
    submitted: boolean = false;
    codeRecuperer: boolean = false;
    errors: {[key: string]: string} = {};

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

    confirmRetrait() {
        this.envoieDialog = false;
        this.messageService.add({
            severity: 'success',
            summary: 'Succées',
            detail: 'Envoie confirmé',
            life: 3000,
        });
    }

    save() {
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
              console.error('Erreur lors de la création du contact:', err);

              if (err.error && err.error.errors) {
                  this.errors = err.error.errors;
              }

              this.messageService.add({
                  severity: 'error',
                  summary: 'Erreur',
                  detail: 'Création du contact échouée. Vérifiez les champs.',
                  life: 5000,
              });
          },
      });
    }

}
