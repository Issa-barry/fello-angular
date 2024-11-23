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
        this.pays = "";
        this.adresse = "";
        this.complement_adresse = "";
        this.ville ="";
        this.code_postal = this.toString(""); 
        this.quartier = "";
        this.region = "";
    }

    // Méthode pour transformer un champ en chaîne
    private toString(value: any): string {
        return value != null ? value.toString() : "";  // Si value est null, on retourne une chaîne vide
    }
}