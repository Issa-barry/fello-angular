import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-transfert-detail',
  standalone: false,
  // imports: [],
  templateUrl: './transfert-detail.component.html',
  styleUrl: './transfert-detail.component.scss',
  providers: [MessageService, ConfirmationService],
  
})
export class TransfertDetailComponent implements OnInit {
  retraitTransfertsDialog: boolean = false;
  submited: boolean = false;
  id: number = this.activatedRoute.snapshot.params['id'];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
     
  }

    /**
     * Ferme la boîte de dialogue
     */
  hideRetraitDialog() {
    this.retraitTransfertsDialog = false;
  }

  goToEditTransfert() {
    this.router.navigate(['/dashboard/transfert/edit/', this.id]);
   }

    /**
     * ouvrir la boîte de dialogue
     */
    openRetraitDialog() {
      this.retraitTransfertsDialog = true;
    }

    saveRetraitTransfert() {
      this.submited = true;
      this.hideRetraitDialog();

        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Retrait effectué avec succès',
          life: 3000,
      });
    }
}
