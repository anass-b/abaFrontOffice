// src/app/view/pages/home/home.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

import { VideoService } from '../../../services/video/video.service';
import { DocumentService } from '../../../services/document/document.service';
import { Video } from '../../../models/video.model';
import { Document } from '../../../models/document.model';
import { environment } from '../../../../environments/environments';
import { AuthService } from '../../../services/auth/auth.service';
import { AbllsTaskService } from '../../../services/ablls-task/ablls-task.service'; // 👈 NEW
import { AbllsTask } from '../../../models/ablls-task.model';       
// src/app/view/pages/home/home.component.ts (en haut du fichier)
type HomeTaskRow = {
  id?: number;
  title: string;
  domainPrefix?: string;
  domainName?: string;
  code?: string;
  views?: number; // optionnel: s'alimente si ton backend expose un "views" / "viewCount"
};
                    // 👈 NEW

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomePageComponent implements OnInit {
  private videoService = inject(VideoService);
  private documentService = inject(DocumentService);
  private router = inject(Router);
  auth = inject(AuthService);
  private abllsTaskService = inject(AbllsTaskService); // 👈 NEW
  
  latestVideos: Video[] = [];
  recentDocs: Document[] = [];

  // Était en "mock" → maintenant vide, alimenté depuis l'API
  topTasks: HomeTaskRow[] = [];

  isLoading = true;

  ngOnInit(): void {
    this.loadData();
  }

  logout(): void {
    this.auth.logOut();
    this.router.navigate(['/login']);
  }
  goToDetail(id: number): void {
    this.router.navigate(['/ablls-task', id]);
  }
  private loadData(): void {
    this.isLoading = true;

    // ----- Vidéos -----
    this.videoService.fetchVideos().subscribe({
      next: (videos) => {
        const items = (videos ?? []).slice();
        items.sort((a, b) => this.dateDesc(a.updatedAt || a.createdAt, b.updatedAt || b.createdAt));
        this.latestVideos = items.slice(0, 6);
      },
      error: () => { /* silencieux */ }
    });

    // ----- Documents -----
    this.documentService.fetchDocuments().subscribe({
      next: (docs) => {
        const items = (docs ?? []).slice();
        items.sort((a, b) => this.dateDesc(a.updatedAt || a.createdAt, b.updatedAt || b.createdAt));
        this.recentDocs = items.slice(0, 5);
      },
      error: () => {}
    });

    // ----- Tâches ABLLS (Top/Récentes) -----
    this.abllsTaskService.fetchTasks().subscribe({
      next: (tasks: AbllsTask[]) => {
        const items = (tasks ?? []).slice();

        // 👉 Choix 1 (par défaut) : classer par "updatedAt" puis "createdAt"
        items.sort((a, b) =>
          this.dateDesc(a.updatedAt || a.createdAt, b.updatedAt || b.createdAt)
        );

        // 👉 Si tu as un champ "views" côté backend (ex: a as any).views :
        // items.sort((a, b) => ((b as any).views ?? 0) - ((a as any).views ?? 0));

        // Mapper vers HomeTaskRow
        this.topTasks = items.slice(0, 5).map(t => ({
          id: t.id,
          title: t.title,
          code: t.code,
          domainPrefix: t.domain?.prefix,
          domainName: t.domain?.name,
          // S'il n’y a pas de compteur de vues dans ton modèle, laisser undefined (on affichera 0)
          views: (t as any).views ?? (t as any).viewCount ?? 0
        }));
      },
      error: () => {},
      complete: () => { this.isLoading = false; }
    });
  }

  // ---------- Actions ----------
  openVideo(id?: number) {
    if (!id) return;
    this.router.navigate(['/videos', id, 'view']);
  }

  openDocument(id?: number) {
    if (!id) return;
    this.router.navigate(['/documents', id, 'view']);
  }

  // ---------- Helpers ----------
  absoluteUrl(u?: string): string | null {
    if (!u) return null;
    return /^https?:\/\//i.test(u) ? u : `${environment.apiUrl}${u.startsWith('/') ? '' : '/'}${u}`;
  }

  formatDuration(minutes?: number): string {
    if (minutes == null) return '';
    const m = Math.floor(minutes);
    const s = Math.round((minutes - m) * 60);
    return s ? `${m}:${String(s).padStart(2, '0')}` : `${m}:00`;
  }

  fileExt(url?: string): string {
    if (!url) return '';
    const p = url.split('?')[0];
    const ext = p.substring(p.lastIndexOf('.') + 1).toUpperCase();
    return ext || '';
  }

  fileExtClass(url?: string): string {
    const ext = this.fileExt(url).toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'doc' || ext === 'docx') return 'doc';
    if (ext === 'xls' || ext === 'xlsx') return 'xls';
    if (ext === 'ppt' || ext === 'pptx') return 'ppt';
    if (['jpg','jpeg','png','gif','webp'].includes(ext)) return 'img';
    if (ext === 'zip') return 'zip';
    return 'file';
  }

  timeAgo(iso?: string): string {
    if (!iso) return '';
    const then = new Date(iso).getTime();
    const now = Date.now();
    const s = Math.floor((now - then) / 1000);
    if (s < 60) return "il y a quelques secondes";
    const m = Math.floor(s / 60);
    if (m < 60) return `il y a ${m} min`;
    const h = Math.floor(m / 60);
    if (h < 24) return `il y a ${h} h`;
    const d = Math.floor(h / 24);
    if (d < 30) return `il y a ${d} j`;
    const mo = Math.floor(d / 30);
    if (mo < 12) return `il y a ${mo} mois`;
    const y = Math.floor(mo / 12);
    return `il y a ${y} an${y > 1 ? 's' : ''}`;
  }

  private dateDesc(a?: string, b?: string): number {
    const ta = a ? new Date(a).getTime() : 0;
    const tb = b ? new Date(b).getTime() : 0;
    return tb - ta;
  }
}
