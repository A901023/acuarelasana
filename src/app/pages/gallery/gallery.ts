
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Preloader } from '../../layouts/components/preloader/preloader';
import { Header } from '../../layouts/components/header/header';
import { GalleryFilter } from '../../features/gallery/components/gallery-filter/gallery-filter';
import { Footer } from '../../layouts/components/footer/footer';
import { ScrollTop } from '../../layouts/components/scroll-top/scroll-top';
import { GalleryPageGrid } from '../../layouts/components/gallery-page-grid/gallery-page-grid';
import { Hero } from '../../layouts/components/hero/hero';

import { GalleryService } from '../../features/gallery/services/gallery.service';
import { Artwork } from '../../core/models/artwork.model';
import { GalleryCategory, GalleryImage } from '../../shared/interfaces/gallery-section.interface';

@Component({
  selector: 'app-gallery',
  imports: [
    Preloader,
    Header,
    GalleryFilter,
    Footer,
    ScrollTop,
    GalleryPageGrid,
    Hero
  ],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly galleryService = inject(GalleryService);

  section?: GalleryCategory;
  images: GalleryImage[] = [];
  loading = true;

  private artworks: Artwork[] = [];
  private unsubscribeArtworks?: () => void;

  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('category');

    if (!categoryId) {
      this.loading = false;
      return;
    }

    this.section = this.galleryService.getCategory(categoryId);

    if (!this.section) {
      this.loading = false;
      return;
    }

    this.unsubscribeArtworks = this.galleryService.getArtworks(artworks => {
      this.artworks = artworks;

      this.images = this.galleryService.getGalleryImages(
        this.artworks,
        categoryId
      );

      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeArtworks?.();
  }
}
