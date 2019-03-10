import { Component } from '@angular/core';
import { Process} from '../../../@core/models';
import { ProcessesService} from '../../../@core/data/processes.service';


@Component({
  selector: 'ngx-processes-list',
  templateUrl: './list.component.html',
})
export class ListComponent {

  processes: Process[];

  constructor(protected service: ProcessesService) {
    this.service.getList({}).subscribe(
      processes => {
        this.processes = processes;
      },
      err => console.error(err),
    );
  }

}
