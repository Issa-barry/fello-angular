import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Transfert } from 'src/app/demo/models/transfert';
import { TransfertService } from 'src/app/demo/service/transfert/transfert.service';

@Component({
    selector: 'app-transfert-retrait',
    templateUrl: './transfert-retrait.component.html',
    styleUrl: './transfert-retrait.component.scss',
    providers: [MessageService, ConfirmationService],
})
export class TransfertRetraitComponent implements OnInit {
  

    transfert: Transfert = new Transfert();
    retraitDialog: boolean = false;
    codeRecuperer: boolean = false;
    errorMessage: string | null = null;
    loading: boolean = false;
    code: string = '';

    constructor(
        private router: Router,
        private transfertService: TransfertService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {}

    /***************************** */

    onCodeRecuperer() {
          if (!this.code.trim()) {
            this.errorMessage = "Veuillez saisir un code valide.";
            return;
        }

        this.loading = true;
        this.errorMessage = null;

        this.transfertService.getTransfertByCode(this.code).subscribe({
            next: (response) => {
                this.transfert = response;
                this.codeRecuperer = true;
                this.loading = false;
            },
            error: (err) => {
                console.error(
                    'Erreur lors de la récupération du transfert:', err );
                this.transfert = new Transfert(); // Réinitialise les données
                this.codeRecuperer = false;
                this.loading = false;
                this.errorMessage = err.message || "Une erreur est survenue lors de la récupération du transfert.";
              },
        });
    }

    
    openRetraitDialog() {
      this.retraitDialog = true;
  }

    hideDialog() {
        this.retraitDialog = false;
    }

    confirmRetrait() {
        this.retraitDialog = false;
        this.messageService.add({
            severity: 'success',
            summary: 'Succées',
            detail: 'Retrait confirmé',
            life: 3000,
        });
    }
}
