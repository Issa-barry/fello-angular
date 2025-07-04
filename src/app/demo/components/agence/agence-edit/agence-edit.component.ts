import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Agence } from 'src/app/demo/models/agence';
import { AgenceService } from 'src/app/demo/service/agence/agence.service';

@Component({
    selector: 'app-agence-edit',
    templateUrl: './agence-edit.component.html',
    styleUrls: ['./agence-edit.component.scss'],
    providers: [MessageService],
})
export class AgenceEditComponent implements OnInit {
    agence: Agence = new Agence();
    submitted = false;
    loading = false;
    isGuineeSelected = false;
    id: number = this.activatedRoute.snapshot.params['id'];
    countries = [
        { name: 'GUINEE-CONAKRY', code: 'GN', value: 'GUINEE-CONAKRY' },
        { name: 'France', code: 'FR', value: 'FRANCE' },
    ];
    apiErrors: { [key: string]: string[] } = {};
    errorMessage = '';

    constructor(
        private route: ActivatedRoute,
        private agenceService: AgenceService,
        private messageService: MessageService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.agenceService.getAgenceById(+id).subscribe({
                next: (data) => {
                    this.agence = data;
                    console.log('agence', this.agence);

                      this.agence.responsable_reference = data.responsable?.reference || '';
                    
                    this.isGuineeSelected = this.agence.adresse.pays === 'GUINEE-CONAKRY';
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: "Impossible de charger l'agence",
                    });
                },
            });
        }
    }

    onCountryChange(event: any) {
        const selectedCountry = event.value;
        if (selectedCountry === 'GUINEE-CONAKRY') {
            this.isGuineeSelected = true;
            this.agence.adresse.code_postal = '00000';
        } else {
            this.isGuineeSelected = false;
            this.agence.adresse.quartier = '';
        }
    }

    updateAgence() {
        this.submitted = true;
        if (!this.agence.id) return;

        const agenceToUpdate = { ...this.agence };
        // if (agenceToUpdate.responsable.reference) {
        //     delete agenceToUpdate.responsable;
        // }

        console.log('agenceToUpdate', agenceToUpdate);
        

        this.agenceService.updateAgence(this.id, agenceToUpdate).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Agence modifiée avec succès',
                });
            },
            error: (err) => { 
                this.apiErrors = err.error?.errors || {};
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: err.message || 'Une erreur est survenue',
                });
            },
        });
    }
}
