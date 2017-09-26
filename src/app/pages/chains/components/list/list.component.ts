import { Component } from '@angular/core';
import { ChainsService } from '../../../../services/chains.service';
import { Chain } from '../../../../models'


@Component({
  selector: 'chains-list-component',
  templateUrl: 'list.html',
  styleUrls: ['./list.scss'],
})
export class ChainsListComponent {

  chains: Chain[];

  constructor(protected service: ChainsService) {
    this.service.getList().subscribe(
      chains => {
        this.chains = chains;
      },
      err => console.error(err),
    );
  }

}
