import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  auth = inject(AuthService);
  router = inject(Router);

  navItems: any[] = [];

  defaultNavItems = [
    { label: 'Accueil', icon: 'bi-house-door-fill', link: '/home' },
    { label: 'Documents', icon: 'bi-file-earmark-text', link: '/documents' },
    { label: 'Formations Vidéo', icon: 'bi-play-circle', link: '/videos' },
    { label: 'Blog', icon: 'bi-journal-text', link: '/bloglist' },
    { label: 'Abonnement', icon: 'bi-credit-card', link: '/subscription' },
    { label: 'Contact', icon: 'bi-envelope', link: '/contact' },
    { label: 'ABA', icon: 'bi-boxes', action: 'openABA' }

  ];

  abllsNavItems = [
    { label: '🔙 Retour', action: 'back', icon: 'bi-arrow-left' },
    { label: 'Taches ABLLS-R', link: '/taches', icon: 'bi-grid' },
    { label: 'Domaines ABLLS-R', link: '/ablls', icon: 'bi-list-check' },
    { label: 'Gestion des taches', link: '/ablls-admin', icon: 'bi-list-check' },
    { label: 'Matériel', link: '/material', icon: 'bi-box' },
    { label: 'Catégories',link: '/categories', icon: 'bi-tags' },
    { label: 'Ligne de base' , link:'/baselines' , icon:'bi-grid'},
    
    
  ];

  ngOnInit(): void {
    this.navItems = this.defaultNavItems;
  }

  onNavClick(item: any): void {
    if (item.action === 'back') {
      this.navItems = this.defaultNavItems;
    } else if (item.action === 'openABA') 
    {
      this.navItems = this.abllsNavItems;
    } else if (item.link) {
      this.router.navigateByUrl(item.link);
    }
  }
}
