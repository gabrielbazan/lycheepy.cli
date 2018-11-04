import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      LycheePy development team. Based on <b><a href="https://akveo.com" target="_blank">Akveo</a></b>.
    </span>
    <div class="socials">
      <a href="https://github.com/gabrielbazan/lycheepy" class="ion ion-social-github"></a>
    </div>
  `,
})
export class FooterComponent {
}
