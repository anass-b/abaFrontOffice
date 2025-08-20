import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  currentUrl = '';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });
  }

  isActive(link: string): boolean {
    return this.currentUrl.startsWith(link);
  }

  toggleSubmenu(id: string) {
    const el = document.getElementById('submenu_' + id);
    if (el) {
      el.style.display = el.style.display === 'block' ? 'none' : 'block';
    }
  }
}
