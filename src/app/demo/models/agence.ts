import { Adresse } from "./adresse";

 
 export class Agence {
    id?: number;
    reference?:string;
    nom_agence: string;
    phone: string;
    email:string;
    date_creation:string;
    adresse: Adresse;
    statut:string;
    constructor()
    {
        this.nom_agence = "";
        this.phone = "";
        this.email = "";
        this.date_creation ="";
        this.statut="client";
        this.adresse = new Adresse();
    }
}