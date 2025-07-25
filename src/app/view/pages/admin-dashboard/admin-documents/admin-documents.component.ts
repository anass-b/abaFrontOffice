import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../../../services/document/document.service';
import { RouterLink } from '@angular/router';
import { Document } from '../../../../models/document.model';

@Component({
  selector: 'app-admin-documents',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-documents.component.html',
  styleUrls : ['./admin-documents.component.scss']
})
export class AdminDocumentsComponent implements OnInit {
  documentService = inject(DocumentService);
  documents: Document[] = [];

  ngOnInit() {
    this.fetchDocuments();
  }

  fetchDocuments() {
    this.documentService.fetchDocuments().subscribe(data => {
      this.documents = data;
    });
  }

  deleteDocument(id: number | undefined) {
    if (confirm('Supprimer ce document ?')) {
      this.documentService.deleteDocument(id).subscribe(() => this.fetchDocuments());
    }
  }
}
