import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Taux } from 'src/app/demo/models/Taux';
import { AuthService } from 'src/app/demo/service/auth/auth.service';
import { DevisesService } from 'src/app/demo/service/devises/devises.service';
import { TauxService } from 'src/app/demo/service/taux/taux.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-general',
  standalone: false,
  // imports: [],
  templateUrl: './general.component.html', 
  styleUrl: './general.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class GeneralComponent implements OnInit{

  devises: any[] = [];
  devise: any = {};
  manyTaux: Taux[] = [];
  oneTaux: Taux = new Taux();
  taux: Taux = new Taux();
  devisesDialog: boolean = false;
  submitted: boolean=false;
  cols: any[] = [];
  statuses: any[] = [];
  
  rowsPerPageOptions = [5, 10, 20];

  constructor(
    private authService:AuthService,
    public router: Router,
    private devisesService: DevisesService,
    private layoutService: LayoutService,
    private tauxService: TauxService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {};


 
  /***********************
   * DEVISE
   ************************/

  getAllDevises(): void {
    this.devisesService.getDevises().subscribe({
      next: (response) => {
        this.devises = response;   
       },
      error: (err) => {
        console.error('Erreur lors de la récupération des contacts:', err);
      }
    });
  }

  openDeviseDialog(){
    this.devisesDialog = true;
    this.devise = {};
    this.submitted = false;    
  } 

  hideDeviseDialog(){
    this.devisesDialog = false;
    this.submitted = false;
  } 

  saveDevise(devise: any){
    // console.log(devise); 
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
   }


  /***********************
   * Taux
   ************************/

  getTauxById(){
    this.tauxService.getTauxById(1).subscribe({
      next: (response) => {
        this.taux = response
        console.log(response);
        
      }, 
      error: (err) => {
        console.error('Erreur lors de la récupération des contacts:', err);
      }
    })
  }

  
  getAllTaux(){
    this.tauxService.getAllTaux().subscribe({
      next: (response) => {
        this.manyTaux = response
        console.log("menyTauxresponse", this.manyTaux);
        
      }, 
      error: (err) => {
        console.error('Erreur lors de la récupération des contacts:', err);
      }
    })
  }

  deleteTauxById(){
    this.tauxService.deleteTauxById(2).subscribe({
      next: () => {
          this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Agence supprimée avec succès',
              life: 3000
          });
          this.getAllTaux(); 
      },
      error: (err) => {
          console.error('Erreur lors de la suppression du taux:', err);
          this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: err.error.message,
              life: 3000
          });
      }
  });
  }

  confirmDelateTaux(){
      this.confirmationService.confirm({
        message:
            'Voulez-vous vraiment affecter le contact à cette agence ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Oui',
        rejectLabel: 'Non',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button-secondary',
        accept: () => this.deleteTauxById(),
        reject: () => {
            this.messageService.add({
                severity: 'info',
                summary: 'Annulation',
                detail: "L'affectation a été abandonnée.",
            });
        },
    });
  }


 

  ngOnInit(): void {
    this.getAllDevises()
    // this.getTauxById()
    this.getAllTaux()
  }

}
