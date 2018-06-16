import { ChainManagementComponent } from '../management'
import { Chain } from '../../../../models'


export class ChainsCreationComponent extends ChainManagementComponent {

  protected loadChainData(): void {
    this.chain = new Chain(
      null,
      null,
      null,
      null,
      null,
      [],
      [],
      {}
    );

    this.processes = [];

    setTimeout(
      () => {
        super.drawGraph();
      },
      250,
    );
  }

  save() {
    this.chain.steps = this.getSteps();
    this.chain.publish = this.getPublish();
    this.chainsService.create(this.chain).subscribe(
      chain => {
        this.router.navigate(
          [`/pages/chains/${chain.id}`],
        );
      },
    );
  }

}
