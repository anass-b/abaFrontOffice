import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-menu',
  standalone : true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  
  auth= inject(AuthService);

  navItems = [
  { label: 'Accueil', icon: 'bi-house-door-fill', link: '/home' },
  { label: 'Documents', icon: 'bi-file-earmark-text', link: '/documents' },
  { label: 'Formations Vidéo', icon: 'bi-play-circle', link: '/videos' },
  { label: 'Blog', icon: 'bi-journal-text', link: '/bloglist' },
  { label: 'Abonnement', icon: 'bi-credit-card', link: '/subscription' },
  { label: 'Contact', icon: 'bi-envelope', link: '/contact' },
  { label: 'Ablls', icon: 'bi-journal-text', link: '/ablls' },
];

  
 

}
