import { Component } from '@angular/core';
import { Footer } from '@components/footer/footer';
import { Tag } from '@components/tag/tag';
import { environment } from '@env/environment';
import { KageButton, KageIcon } from 'kage-ui';

@Component({
  selector: 'app-about',
  imports: [Tag, KageIcon, KageButton, Footer],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  appName = environment.app.name;
}
