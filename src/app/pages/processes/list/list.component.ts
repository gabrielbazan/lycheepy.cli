import { Component } from '@angular/core';
import { Process} from '../../../@core/models';
import { ProcessesService} from '../../../@core/data/processes.service';
import { Router } from '@angular/router';


@Component({
  selector: 'ngx-processes-list',
  templateUrl: './list.component.html',
})
export class ListComponent {

  processes: Process[];

  constructor(protected service: ProcessesService, private router: Router) {
    this.service.getList({}).subscribe(
      processes => {
        this.processes = processes;
      },
      err => console.error(err),
    );
  }

  protected redirectToDetail(id: number) {
    this.router.navigate(['/pages/process/' + id]);
  }

}
