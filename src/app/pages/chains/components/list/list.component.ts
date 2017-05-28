import { Component } from '@angular/core';
import { ChainsService } from '../../chains.service';


@Component({
  selector: 'chains-list-component',
  templateUrl: 'list.html',
  styleUrls: ['./list.scss'],
})
export class ChainsListComponent {

  chains: object[];

  constructor(protected service: ChainsService) {
    this.service.getList().subscribe(
      data => {
        this.chains = data.json().results;
      },
      err => console.error(err),
      () => console.log('Retrieved users list'),
    );
  }

}
