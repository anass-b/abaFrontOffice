import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenuComponent, NavbarComponent, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  auth = inject(AuthService);

  /** Sidebar visible uniquement desktop par défaut; sur mobile fermée */
  isSidebarVisible = false;
  isMobileView = window.innerWidth < 992;

  ngOnInit(): void {
    this.syncResponsiveState();
  }

  @HostListener('window:resize')
  onResize() {
    this.syncResponsiveState();
  }

  private syncResponsiveState() {
    this.isMobileView = window.innerWidth < 992;
    // Desktop: sidebar toujours ouverte ; Mobile/Tablet: fermée par défaut
    this.isSidebarVisible = this.isMobileView ? false : true;
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  /** Utilisé dans le template si besoin */
  isMobile(): boolean {
    return this.isMobileView;
  }
}
