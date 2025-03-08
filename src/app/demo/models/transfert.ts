
 export class Transfert {
    id?: number;
    code?:string;
    statut?:string;
    devise_source_id: number;  // id = 2 = euro
    devise_cible_id: number;   // id  = 3 = franc guinéen
    montant: number;
    quartier: string;
    receveur_nom: string;
    receveur_prenom: string;
    receveur_phone: string;
    expediteur_nom: string;
    expediteur_prenom: string;
    expediteur_phone: string;
    expediteur_email: string;
    

    constructor()
    {
        this.devise_source_id = 2;
        this.devise_cible_id = 1;
        this.montant=0;
        this.quartier="";
        this.receveur_prenom="";
        this.receveur_nom="";
        this.receveur_phone="";
        this.expediteur_nom="";
        this.expediteur_prenom="";
        this.expediteur_phone="";
        this.expediteur_email="";
    }
}