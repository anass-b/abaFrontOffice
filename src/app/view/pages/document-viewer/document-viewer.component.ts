import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from '../../../services/document/document.service';
import { Document } from '../../../models/document.model';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../../services/safeUrlPipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-viewer',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss']
})
export class DocumentViewerComponent implements OnInit, OnDestroy {
  private documentService = inject(DocumentService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  doc: Document | null = null;
  pdfViewerUrl: string | null = null;
  blobUrl: string | null = null; // store blob URL to revoke later

  ngOnInit(): void {
    // 🔒 Disable right click + shortcuts
    document.addEventListener('contextmenu', this.disableRightClick);
    document.addEventListener('keydown', this.disableShortcuts);

    const id = Number(this.route.snapshot.paramMap.get('id'));

    // 📄 Get document metadata
    this.documentService.fetchDocumentById(id).subscribe({
      next: (data: Document) => {
        this.doc = data;

        // 🎯 Stream as Blob instead of exposing URL
        this.documentService.streamDocumentById(id).subscribe(blob => {
          if (blob instanceof Blob) {
            this.blobUrl = URL.createObjectURL(blob);
            this.pdfViewerUrl = `assets/pdfjs/web/viewer.html?file=${encodeURIComponent(this.blobUrl)}`;
          }
        });
      },
      error: () => console.error('❌ Erreur lors du chargement du document')
    });
  }

  disableRightClick = (e: MouseEvent) => e.preventDefault();

  disableShortcuts = (e: KeyboardEvent) => {
    if (e.ctrlKey && ['s', 'p', 'u'].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
  };
  goBack(): void {
    this.router.navigate(['/documents']);
  }

  ngOnDestroy() {
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
    }
    document.removeEventListener('contextmenu', this.disableRightClick);
    document.removeEventListener('keydown', this.disableShortcuts);
  }
}
