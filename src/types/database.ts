export type UserRole = 'etudiant' | 'personnel' | 'admin';
export type DemandeStatut = 'nouveau' | 'en_cours' | 'resolu' | 'refuse';

export interface Profile {
  id: string;
  nom: string;
  email: string;
  role: UserRole;
  bloque: boolean;
  created_at: string;
}

export interface Categorie {
  id: string;
  nom: string;
}

export interface Lieu {
  id: string;
  nom: string;
  batiment: string | null;
}

export interface Demande {
  id: string;
  titre: string;
  description: string | null;
  categorie_id: string | null;
  lieu_id: string | null;
  auteur_id: string;
  statut: DemandeStatut;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
  categorie?: Categorie;
  lieu?: Lieu;
}

export interface Reports {
  total: number;
  resolus: number;
  en_cours: number;
  nouveau: number;
}