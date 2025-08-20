import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router, RouterLink , RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink , RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  /** Affiche le bouton hamburger (admin, mobile/tablette) */
  @Input() showToggle = false;

  /** Affiche le menu profil admin (Profil / Déconnexion) */
  @Input() showAdminProfileMenu = false;

  /** Événement pour ouvrir/fermer la sidebar */
  @Output() toggle = new EventEmitter<void>();

  // ⚠ public pour usage dans le template
  public auth = inject(AuthService);
  private router = inject(Router);

  onToggle(): void {
    this.toggle.emit();
  }

  logout(): void {
    this.auth.logOut();
    this.router.navigate(['/login']);
  }
}
