import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { FirestoreService } from '../../../core/services/firestore.service';
import { Artwork } from '../../../core/models/artwork.model';
import {
  GalleryCategory,
  GalleryImage,
} from '../../../shared/interfaces/gallery-section.interface';
import { GALLERY_SECTIONS } from '../data/gallery.data';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  private readonly firestoreService = inject(FirestoreService);

  /**
   * Obtiene todas las obras de Firestore en tiempo real.
   */
  getArtworks(callback: (artworks: Artwork[]) => void): () => void {
    return this.firestoreService.getArtworks(callback);
  }

  /**
   * Obtiene una categoría por su identificador.
   */
  getCategory(id: string): GalleryCategory | undefined {
    return GALLERY_SECTIONS.find((category) => category.id === id);
  }

  /**
   * Convierte una obra de Firestore al formato de la galería.
   */
  private mapArtworkToGalleryImage(artwork: Artwork): GalleryImage {
    return {
      src: artwork.imageUrl,
      alt: artwork.alt || artwork.title,
      title: artwork.title,
    };
  }

  /**
   * Filtra las obras por categoría y las convierte en GalleryImage.
   */

  getGalleryImages(artworks: Artwork[], categoryId: string): GalleryImage[] {
    console.group('[GalleryService] getGalleryImages');

    const normalizedCategory = this.normalizeCategory(categoryId);

    console.log('Categoría solicitada:', categoryId);
    console.log('Categoría normalizada:', normalizedCategory);

    const filteredArtworks = artworks.filter((artwork) => {
      const artworkCategory = this.normalizeCategory(artwork.category);

      return artworkCategory === normalizedCategory && artwork.visible !== false;
    });

    console.log('Obras encontradas:', filteredArtworks.length);

    const images = filteredArtworks
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((artwork) => this.mapArtworkToGalleryImage(artwork));

    console.table(images);

    console.groupEnd();

    return images;
  }

  /**
   * Devuelve las secciones estáticas de la página principal.
   */
  getHomeSections(): GalleryCategory[] {
    return GALLERY_SECTIONS;
  }

  private normalizeCategory(category: string): string {
    return category
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');
  }
}
