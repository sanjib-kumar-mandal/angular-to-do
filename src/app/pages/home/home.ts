import { Component } from '@angular/core';
import { KageButton, KageIcon } from 'kage-ui';
import { Footer } from '@components/footer/footer';
import { environment } from '@env/environment';
import { Tag } from '@components/tag/tag';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [KageButton, Footer, Tag, KageIcon, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  appName = environment.app.name;
}
