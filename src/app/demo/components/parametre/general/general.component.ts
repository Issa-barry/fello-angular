import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/demo/service/auth/auth.service';
import { DevisesService } from 'src/app/demo/service/devises/devises.service';
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
  ) {};


  ngOnInit(): void {
    this.getAllDevises()
  }


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
}
