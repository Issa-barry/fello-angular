import { Adresse } from "./adresse";

 
 export class Agence {
    id?: number;
    reference?:string;
    nom_agence: string;
    phone: string;
    email:string;
    // date_creation?:Date;
    adresse: Adresse;
    statut:string;
    constructor()
    {
        this.nom_agence = "";
        this.phone = "";
        this.email = "";
        // this.date_creation = new Date('9999-01-01T00:00:00');
        this.statut="attente";
        this.adresse = new Adresse();
    }
}  