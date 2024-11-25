import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TransfertService } from 'src/app/demo/service/transfert/transfert.service';

@Component({
  selector: 'app-transfert-retrait',
  templateUrl: './transfert-retrait.component.html',
  styleUrl: './transfert-retrait.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class TransfertRetraitComponent implements OnInit{
  quantities: number[] = [1, 1, 1];

  value: string = '';

  checked: boolean = true;

  checked2: boolean = true;

  cities = [
      { name: 'USA / New York', code: 'NY' },
      { name: 'Italy / Rome', code: 'RM' },
      { name: 'United Kingdoom / London', code: 'LDN' },
      { name: 'Turkey / Istanbul', code: 'IST' },
      { name: 'France / Paris', code: 'PRS' }
  ];

  selectedCity: string = '';

  retraitDialog: boolean = false; 
  submitted: boolean = false;
  codeRecuperer : boolean = false;

  constructor(
    private router: Router,
    private transfertService: TransfertService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }


  ngOnInit(): void {
    
  }

  hideDialog() {
    this.retraitDialog = false;
    this.submitted = false;
 }
 
 onCodeRecuperer(){
  this.codeRecuperer = true;
 }

 openRetraitDialog() {
  this.submitted = false;
  this.retraitDialog = true;
}

confirmRetrait() { 
  this.retraitDialog = false;
   this.messageService.add({ severity: 'success', summary: 'Succées', detail: 'Retrait confirmé', life: 3000 });
}


}
