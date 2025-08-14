import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialPhotoService } from '../../../services/material-photo/material-photo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-material-list',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './material-list.component.html',
  styleUrls: []
})
export class MaterialListComponent implements OnInit {
  materialService = inject(MaterialPhotoService);
  router = inject(Router);

  materials: any[] = [];
  search = '';

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.materialService.fetchAll().subscribe({
      next: (res) => this.materials = res,
      error: err => console.error('Erreur chargement matériel', err)
    });
  }
  getFilteredMaterials(): any[] {
    const term = this.search.toLowerCase().trim();
    return this.materials.filter(mat =>
      mat.name?.toLowerCase().includes(term) ||
      mat.description?.toLowerCase().includes(term) ||
      mat.videoUrl?.toLowerCase().includes(term)
    );
  }
  onAdd(): void {
    this.router.navigate(['/material/new']);
  }

  onEdit(id: number): void {
    this.router.navigate(['/material/edit', id]);
  }

  onDelete(id: number): void {
    if (!confirm('Confirmer la suppression ?')) return;
    this.materialService.delete(id).subscribe({
      next: () => this.loadMaterials(),
      error: err => console.error('Erreur suppression', err)
    });
  }
}
