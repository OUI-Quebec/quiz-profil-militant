import { Injectable, signal } from '@angular/core';
import { Profil } from '../model/profil';
import * as yaml from 'js-yaml';

@Injectable({
  providedIn: 'root',
})
export class ProfilService {
  private _profils = signal<Profil[]>([]);

  // Signal public (readonly)
  profils = this._profils.asReadonly();

  constructor() {
    this.chargerProfils();
  }

  /**
   * Charge les données des profils depuis le fichier YAML
   */
  private async chargerProfils(): Promise<void> {
    try {
      const response = await fetch('/profils.yaml');
      const yamlText = await response.text();
      const profils = yaml.load(yamlText) as Profil[];
      this._profils.set(profils);
    } catch (error) {
      console.error('Erreur lors du chargement des profils:', error);
    }
  }

  /**
   * Récupère un profil par son nom
   */
  getProfilParNom(nom: string): Profil | undefined {
    return this._profils().find((profil) => profil.nom === nom);
  }

  /**
   * Récupère tous les profils
   */
  getTousProfils(): Profil[] {
    return this._profils();
  }
}
