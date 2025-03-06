import { Civilite } from "../enums/civilite.enum";
import { Adresse } from "./adresse";
import { Role } from "./Role";

 
 export class Contact {
    id?: number;
    reference?:string;
    civilite?:Civilite;
    nom: string;
    prenom: string;
    phone: string;
    email:string;
    date_naissance?:string;
    password:string;
    password_confirmation:string;
    role_id?:number;
    roles?: Role;
    statut: string;
    role?: any;
    adresse: Adresse;

    constructor()
    {
        this.role ="";
        this.nom = "";
        this.prenom ="";
        this.civilite=Civilite.Autre;
        this.date_naissance="1999-01-01";
        this.password="";
        this.password_confirmation="";
        this.phone = "";
        this.email = "";
        this.statut="attente";
        this.adresse = new Adresse();
        this.roles= new Role();
    }
}  