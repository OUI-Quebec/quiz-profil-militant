export interface Choix {
  reponse: string;
  type:
    | 'Discret'
    | 'Idées'
    | 'Socio-culturel'
    | 'Activiste'
    | 'Coordonateur-trice';
}
