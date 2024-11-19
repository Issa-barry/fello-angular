import { Adresse } from './adresse';
import { Message } from './message';

export interface Agence {
    id: number;
    reference:string;
    nom_agence: string;
    phone: string;
    email:string;
    date_creation:string;
    adresse: Adresse;
    statut:string;
}