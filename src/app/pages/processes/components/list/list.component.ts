import { Component } from '@angular/core';
import { ProcessesService } from '../../../../services/processes.service';
import { Process } from '../../../../models'


@Component({
  selector: 'processes-list-component',
  templateUrl: 'list.html',
  styleUrls: ['./list.scss'],
})
export class ProcessesListComponent {

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
