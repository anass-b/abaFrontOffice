import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from '../../../services/document/document.service';
import { Document } from '../../../models/document.model';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../../services/safeUrlPipe';

@Component({
  selector: 'app-document-viewer',
  standalone: true,
  imports: [CommonModule , SafeUrlPipe],
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss']
})
export class DocumentViewerComponent implements OnInit {
  documentService = inject(DocumentService);
  route = inject(ActivatedRoute);
  doc: Document | null = null;

  ngOnInit(): void {
     document.addEventListener('contextmenu', this.disableRightClick);
    document.addEventListener('keydown', this.disableShortcuts);
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.documentService.fetchDocumentById(id).subscribe({
      next: (data) => this.doc = data,
      error: () => console.error("Erreur lors du chargement du document")
    });
  }
  disableRightClick = (e: MouseEvent) => e.preventDefault();
  disableShortcuts = (e: KeyboardEvent) => {
  if (e.ctrlKey && ['s', 'p', 'u'].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
};
ngOnDestroy() {
  document.removeEventListener('contextmenu', this.disableRightClick);
  document.removeEventListener('keydown', this.disableShortcuts);
}
}
