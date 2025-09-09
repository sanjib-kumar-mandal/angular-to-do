import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { CurrentUserModel } from '@services/auth/auth.interface';
import { AuthService } from '@services/auth/auth.service';
import { KageDrawerCtrl, KageIcon } from 'kage-ui';

@Component({
  selector: 'app-header',
  imports: [RouterLink, KageIcon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  // Injectable
  private readonly drawer = inject(KageDrawerCtrl);
  private readonly authService = inject(AuthService);
  // Local variables
  appName = environment.app.name;
  isLoggedIn: boolean = false;
  // Element ref
  @ViewChild('drawerTemplate', { read: TemplateRef })
  drawerTemplate!: TemplateRef<any>;

  constructor() {
    this.authService.user.get().subscribe({
      next: (data) => (this.isLoggedIn = Boolean(data)),
    });
  }

  openDrawer() {
    this.drawer.openFromTemplate(this.drawerTemplate, {
      position: 'left',
      width: '320px',
    });
  }
}
