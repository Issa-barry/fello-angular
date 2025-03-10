import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Civilite } from 'src/app/demo/enums/civilite.enum';
import { Contact } from 'src/app/demo/models/contact';
import { Role } from 'src/app/demo/models/Role';
import { ContactService } from 'src/app/demo/service/contact/contact.service';
import { RoleService } from 'src/app/demo/service/role/role.service';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class ContactDetailComponent implements OnInit {
  @Input() contact: Contact = new Contact();
  @Input() role: Role = new Role();
  roles: Role[] = [];
  id: number = this.activatedRoute.snapshot.params['id'];

  submitted = false;
  loading = false;
  errors: { [key: string]: string } = {};
  isGuineeSelected = false;
  paysAChanger = false;
  adresseCache = { ville: '', pays: '', code_postal: '', adresse: '', quartier: '' };
  civiliteOptions = Object.values(Civilite).map(civ => ({ label: civ, value: civ }));

  countries = [
    { name: 'GUINEE-CONAKRY', code: 'GN'},
    { name: 'France', code: 'FR'},
  ];

  constructor(
    private contactService: ContactService,
    private roleService: RoleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllRoles();
    this.onGetContact();
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
    this.contact.adresse = { ...this.contact.adresse, pays, code_postal, adresse };
  }

  private restorePreviousAddress(pays: string) {
    if (this.adresseCache.pays === 'France') {
      Object.assign(this.contact.adresse, this.adresseCache);
    } else {
      this.contact.adresse = { pays, adresse: '', code_postal: '', ville: '', quartier: '', complement_adresse :'', region:'' };
    }
  }

  getAllRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (response) => {
        this.roles = response;
        this.contact.role = this.roles.find(role => role.id === this.contact.role?.id) || null;
      }
    });
  }

  getRoleById(id: number): void {
    this.roleService.getRoleById(id).subscribe({
      next: (resp) => this.contact.role = resp.name,
      error: (err) => console.error('Erreur lors de la récupération du rôle:', err)
    });
  }

  onGetContact(): void {
    this.loading = true;
    this.contactService.getContactById(this.id).subscribe({
      next: (resp) => {
        this.contact = resp;
        this.isGuineeSelected = this.contact.adresse.pays === 'GUINEE-CONAKRY';
        Object.assign(this.adresseCache, this.contact.adresse);
        if (this.contact.role_id) this.getRoleById(this.contact.role_id);
        this.loading = false;
      },
      error: (err) => console.error('Erreur lors de la récupération du contact:', err)
    });
  }

  private isContactValid(): boolean {
    return !!(
      this.contact.role && this.contact.civilite && this.contact.nom_complet &&
      this.contact.email && this.contact.phone && this.contact.adresse && this.contact.adresse.pays &&
      this.contact.adresse.ville && this.contact.adresse.code_postal
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
    this.contact.adresse.code_postal = this.contact.adresse.code_postal?.trim();
    this.contact.adresse.ville = this.contact.adresse.ville?.trim();
    this.contact.adresse.quartier = this.contact.adresse.quartier?.trim();
  }

  saveContact() {
        this.submitted = true;
        this.trimFields();
        this.errors = {};
        // this.loading = true;

        console.log(this.contact);
        
        if (!this.isContactValid()) {
          this.showMessage('warn', 'Attention', 'Veuillez remplir tous les champs obligatoires.');
          this.loading = false;
          return;
        }

        const selectedRole = this.roles.find(r => r.name === this.contact.role);
        this.contact.roles = selectedRole;

        this.contactService.updateContact(this.id, this.contact).subscribe({
          next: (resp) => {
            this.contact = resp;
            this.showMessage('success', 'Succès', 'Les données du contact ont été mises à jour avec succès.');
            this.submitted = false;
            this.errors = {};
            this.loading = false;
            this.onGetContact();
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour du contact:', err);
            this.errors = err.error?.errors || {};
            this.showMessage('error', 'Erreur', 'Mise à jour du contact échouée. Vérifiez les champs.');
            this.loading = false;
          }
        });
  }


}
