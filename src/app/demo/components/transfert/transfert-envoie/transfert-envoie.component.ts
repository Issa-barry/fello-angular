import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TransfertService } from 'src/app/demo/service/transfert/transfert.service';

@Component({
  selector: 'app-transfert-envoie',
  // standalone: true,
  // imports: [],
  templateUrl: './transfert-envoie.component.html',
  styleUrl: './transfert-envoie.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class TransfertEnvoieComponent  implements OnInit {

  quantities: number[] = [1, 1, 1];

  value: string = '';

  checked: boolean = true;

  checked2: boolean = true;

  cities = [
      { name: 'Cosa / Conakry', code: 'NY' },
      { name: 'Banbeto / Conakry', code: 'RM' },
      { name: 'Foundin / Dabola', code: 'LDN' },
      { name: 'Hamdallaye / Dabola', code: 'IST' },
      { name: 'Abatoire / Mamou', code: 'PRS' }
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
