
 export class Transfert {
    id?: number;
    code?:string;
    statut?:string;
    frais?:number;
    total?:number;
    devise_source_id: number;  // id = 2 = euro
    devise_cible_id: number;   // id  = 3 = franc guinéen
    montant_expediteur: number;
    montant_receveur?: number;
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
        this.devise_cible_id = 3;
        this.frais = 0;
        this.total=0;
        this.montant_expediteur=0;
        this.montant_receveur=0;
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