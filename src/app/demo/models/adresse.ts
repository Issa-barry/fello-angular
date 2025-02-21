export class Adresse {
    id?: number;
    pays:string;
    adresse:string;
    complement_adresse:string;
    ville:string;
    code_postal:string;
    quartier:string;    
    region:string; 
    constructor()
    {
        this.pays = "test";
        this.adresse = "test";
        this.complement_adresse = "";
        this.ville ="test";
        this.code_postal = "";
        this.quartier = "test";
        this.region = "test";
    }

   
}