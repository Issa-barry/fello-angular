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
        this.code_postal = this.toString("6666"); 
        this.quartier = "test";
        this.region = "test";
    }

    // Méthode pour transformer un champ en chaîne
    private toString(value: any): string {
        return value != null ? value.toString() : "";  // Si value est null, on retourne une chaîne vide
    }
}