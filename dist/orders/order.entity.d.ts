import { OrderStatus, MealSlot, PaymentMethod } from '../common/enums/index';
import { User } from '../users/user.entity';
import { Dish } from '../dishes/dish.entity';
import { Organisation } from '../organisations/organisation.entity';
export declare class Order {
    id: string;
    numero_commande: string;
    qr_code_token: string;
    statut: OrderStatus;
    creneau: MealSlot;
    date_livraison: string;
    montant_total: number;
    montant_subvention: number;
    montant_employe: number;
    methode_paiement: PaymentMethod;
    points_gagnes: number;
    date_recuperation: Date;
    recupere_par: string;
    employe: User;
    employe_id: string;
    organisation: Organisation;
    organisation_id: string;
    plats: Dish[];
    created_at: Date;
    updated_at: Date;
}
