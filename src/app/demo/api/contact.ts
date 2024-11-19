import { Adresse } from './adresse';
import { Message } from './message';

export interface Contact {
    id: number;
    nom: string;
    prenom: string;
    phone: string;
    email:string;
    date_naissance:string;
    password:string;
    password_confirmation:string;
    role:string;
    status: string;
    adresse_id: Adresse;
}