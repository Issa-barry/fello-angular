import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Civilite } from 'src/app/demo/enums/civilite.enum';
import { Agence } from 'src/app/demo/models/agence';
import { Contact } from 'src/app/demo/models/contact';
import { Role } from 'src/app/demo/models/Role';
import { AgenceService } from 'src/app/demo/service/agence/agence.service';
import { ContactService } from 'src/app/demo/service/contact/contact.service';
import { RoleService } from 'src/app/demo/service/role/role.service';

@Component({
    selector: 'app-contact-detail',
    templateUrl: './contact-detail.component.html',
    styleUrl: './contact-detail.component.scss',
    providers: [MessageService, ConfirmationService],
})
export class ContactDetailComponent implements OnInit {
    @Input() contact: Contact = new Contact();
    @Input() role: Role = new Role();
    roles: Role[] = [];
    id: number = this.activatedRoute.snapshot.params['id'];
    isEditing: boolean = false;



    submitted = false;
    loading = false;
    errors: { [key: string]: string } = {};
    isGuineeSelected = false;
    paysAChanger = false;
    adresseCache = {
        ville: '',
        pays: '',
        code_postal: '',
        adresse: '',
        quartier: '',
    };
    civiliteOptions = Object.values(Civilite).map((civ) => ({
        label: civ,
        value: civ,
    }));
    agenceDialog = false;
    errorMessage: string | null = null;
    codeRecuperer: boolean = false;
    code: string = '';
    reference: number = 0;
    agence: Agence = new Agence();
    loadingAgence: boolean = false;

    countries = [
        { name: 'GUINEE-CONAKRY', code: 'GN' },
        { name: 'France', code: 'FR' },
    ];

    constructor(
        private contactService: ContactService,
        private agenceService: AgenceService,
        private roleService: RoleService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {} 

    toggleEditMode() {
      this.isEditing = !this.isEditing;
  }
  
    onCountryChange(event: any) {
        const selectedCountry = event.value;
        this.paysAChanger = true;
        this.isGuineeSelected = selectedCountry === 'GUINEE-CONAKRY';

        if (this.isGuineeSelected) {
            this.setAddressData(selectedCountry, '00224', 'GUINEE-CONAKRY');
        } else {
            this.restorePreviousAddress(selectedCountry);
        }
    }

    private setAddressData(pays: string, code_postal: string, adresse: string) {
        this.contact.adresse = {
            ...this.contact.adresse,
            pays,
            code_postal,
            adresse,
        };
    }

    private restorePreviousAddress(pays: string) {
        if (this.adresseCache.pays === 'France') {
            Object.assign(this.contact.adresse, this.adresseCache);
        } else {
            this.contact.adresse = {
                pays,
                adresse: '',
                code_postal: '',
                ville: '',
                quartier: '',
                complement_adresse: '',
                region: '',
            };
        }
    }

    getAllRoles(): void {
        this.roleService.getRoles().subscribe({
            next: (response) => {
                this.roles = response;
                this.contact.role =
                    this.roles.find(
                        (role) => role.id === this.contact.role?.id
                    ) || null;
            },
        });
    }

    getRoleById(id: number): void {
        this.roleService.getRoleById(id).subscribe({
            next: (resp) => (this.contact.role = resp.name),
            error: (err) =>
                console.error('Erreur lors de la récupération du rôle:', err),
        });
    }

    private isContactValid(): boolean {
        return !!(
            this.contact.role &&
            this.contact.civilite &&
            this.contact.nom_complet &&
            this.contact.email &&
            this.contact.phone &&
            this.contact.adresse &&
            this.contact.adresse.pays &&
            this.contact.adresse.ville &&
            this.contact.adresse.code_postal
        );
    }

    private showMessage(severity: string, summary: string, detail: string) {
        this.messageService.add({ severity, summary, detail, life: 3000 });
    }

    trimFields() {
        this.contact.nom_complet = this.contact.nom_complet?.trim();
        this.contact.email = this.contact.email?.trim();
        this.contact.phone = this.contact.phone?.trim();
        this.contact.adresse.pays = this.contact.adresse.pays?.trim();
        this.contact.adresse.adresse = this.contact.adresse.adresse?.trim();
        this.contact.adresse.code_postal =
            this.contact.adresse.code_postal?.trim();
        this.contact.adresse.ville = this.contact.adresse.ville?.trim();
        this.contact.adresse.quartier = this.contact.adresse.quartier?.trim();
    }

    saveContact() {
        this.submitted = true;
        this.trimFields();
        this.errors = {};
        // this.loading = true;

        if (!this.isContactValid()) {
            this.showMessage(
                'warn',
                'Attention',
                'Veuillez remplir tous les champs obligatoires.'
            );
            this.loading = false;
            return;
        }

        const selectedRole = this.roles.find(
            (r) => r.name === this.contact.role
        );
        this.contact.roles = selectedRole;

        this.contactService.updateContact(this.id, this.contact).subscribe({
            next: (resp) => {
                this.contact = resp;
                this.showMessage(
                    'success',
                    'Succès',
                    'Les données du contact ont été mises à jour avec succès.'
                );
                this.submitted = false;
                this.errors = {};
                this.loading = false;
                this.isEditing = false;
                this.onGetContact();
            },
            error: (err) => {
                console.error('Erreur lors de la mise à jour du contact:', err);
                this.errors = err.error?.errors || {};
                this.showMessage(
                    'error',
                    'Erreur',
                    'Mise à jour du contact échouée. Vérifiez les champs.'
                );
                this.loading = false;
            },
        });
    }

    hideDialog() {
        this.agenceDialog = false;
    }

    openAffecterAgenceDialog() {
        this.agenceDialog = true;
    }

    ngOnInit() {
        this.getAllRoles();
        this.onGetContact();
        // this.getAgenceById(1);

        // Attendre que le contact soit chargé avant d'appeler `getAgenceById`
        setTimeout(() => {
            if (this.contact.agence_id) {
                this.getAgenceById(this.contact.agence_id);
            }
        }, 500);
    } 

    onGetContact(): void {
        this.loading = true;
        this.contactService.getContactById(this.id).subscribe({
            next: (resp) => {
                this.contact = resp;

                // Vérifier si l'adresse existe avant d'y accéder
                if (this.contact.adresse) {
                    this.isGuineeSelected =
                        this.contact.adresse.pays === 'GUINEE-CONAKRY';
                    Object.assign(this.adresseCache, this.contact.adresse);
                } else {
                    this.contact.adresse = {
                        pays: '',
                        ville: '',
                        code_postal: '',
                        adresse: '',
                        quartier: '',
                        complement_adresse: '',
                        region: '',
                    };
                }

                // Récupérer le rôle si défini
                if (this.contact.role_id) {
                    this.getRoleById(this.contact.role_id);
                }

                // Récupérer l'agence uniquement si agence_id est défini
                if (this.contact.agence_id) {
                    this.getAgenceById(this.contact.agence_id);
                } else {
                    this.agence = new Agence(); // Assurez-vous que l'agence est réinitialisée
                }

                this.loading = false;
            },
            error: (err) => {
                console.error(
                    'Erreur lors de la récupération du contact:',
                    err
                );
                this.loading = false;
            },
        });
    }

    getAgenceById(id: number): void {
        if (!id) {
            this.errorMessage = 'Aucune agence associée à ce contact.';
            this.agence = new Agence(); // Réinitialiser l'agence si aucun id
            return;
        }

        this.loadingAgence = true;
        this.errorMessage = null;
        this.codeRecuperer = false;

        this.agenceService.getAgenceById(id).subscribe({
            next: (resp) => {
                if (resp) {
                    this.agence = resp;
                    this.codeRecuperer = true;
                } else {
                    this.agence = new Agence(); // S'assurer que l'agence est bien initialisée
                }
                this.loadingAgence = false;
            },
            error: (err) => {
                console.error(
                    "Erreur lors de la récupération de l'agence:",
                    err
                );
                this.errorMessage = 'Agence introuvable avec cette référence.';
                this.agence = new Agence(); // Réinitialiser l'objet agence
                this.codeRecuperer = false;
                this.loadingAgence = false;
            },
        });
    }

    onRecupererAgence() {
        this.getAgenceById(this.reference);
    }

    confirmationAffecterAgence() {
        this.confirmationService.confirm({
            message:
                'Voulez-vous vraiment affecter le contact à cette agence ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui',
            rejectLabel: 'Non',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => this.affecterAgence(),
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Annulation',
                    detail: "L'affectation a été abandonnée.",
                });
            },
        });
    } 

    affecterAgence(): void {
        if (!this.contact.id || !this.reference) {
            this.errorMessage = 'Veuillez saisir une référence valide.';
            return;
        }

        this.loadingAgence = true;
        this.errorMessage = null;

        this.contactService
            .affecterAgenceById(this.contact.id, this.reference)
            .subscribe({
                next: (updatedContact) => { 
                    // Vérifier et initialiser `adresse` si elle est absente
                    if (!updatedContact.adresse) {
                        updatedContact.adresse = {
                            pays: '',
                            ville: '',
                            code_postal: '',
                            adresse: '',
                            quartier: '',
                            complement_adresse: '',
                            region: '',
                        };
                    }

                    // Mise à jour du contact
                    this.contact = updatedContact;

                    // Récupérer l'agence après affectation
                    if (this.contact.agence_id) {
                        this.getAgenceById(this.contact.agence_id);
                    } else {
                        this.agence = new Agence(); // Réinitialiser l'agence
                    }

                    // ✅ Affichage du message de succès
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: "L'affectation a été réalisée avec succès.",
                        life: 3000,
                    });

                    // ✅ Arrêt du loading et fermeture de la modale
                    this.loadingAgence = false;
                    this.agenceDialog = false;
                },
                error: (err) => {
                    console.error(
                        " Erreur lors de l'affectation de l'agence:",
                        err
                    );
                    this.errorMessage =
                        err.message || 'Une erreur est survenue.';

                    // ✅ Correction : S'assurer que `this.errorMessage` est bien une chaîne
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail:
                            this.errorMessage ??
                            'Une erreur inconnue est survenue.',
                        life: 5000,
                    });

                    this.loadingAgence = false;
                },
            });
    }

    desaffecterAgence(): void {
      if (!this.contact.id) {
          this.messageService.add({
              severity: 'warn',
              summary: 'Attention',
              detail: "Aucun contact sélectionné.",
              life: 3000
          });
          return;
      }
  
      this.confirmationService.confirm({
          message: "Voulez-vous vraiment désaffecter ce contact de son agence ?",
          header: "Confirmation",
          icon: "pi pi-exclamation-triangle",
          acceptLabel: "Oui",
          rejectLabel: "Non",
          acceptButtonStyleClass: "p-button-danger",
          rejectButtonStyleClass: "p-button-secondary",
          accept: () => {
              this.loadingAgence = true;
  
              // Vérification explicite que `id` est bien défini
              if (this.contact.id !== undefined) {
                  this.contactService.desaffecterAgence(this.contact.id).subscribe({
                      next: (updatedContact) => {                          
                          // Réinitialisation de l'agence
                          this.contact = updatedContact;
                          this.agence = new Agence();
                          
                          this.messageService.add({
                              severity: 'success',
                              summary: 'Succès',
                              detail: "Le contact a été désaffecté avec succès.",
                              life: 3000
                          });
                          this.loadingAgence = false;
                      },
                      error: (err) => {
                          console.error('Erreur lors de la désaffectation de l\'agence:', err);
  
                          this.messageService.add({
                              severity: 'error',
                              summary: 'Erreur',
                              detail: err.message || "Une erreur est survenue lors de la désaffectation.",
                              life: 5000
                          });
  
                          this.loadingAgence = false;
                      }
                  });
              } else {
                  console.error("Erreur : L'ID du contact est indéfini.");
                  this.loadingAgence = false;
              }
          }
      });
  }
  
  
}
