import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProcessesService } from '../../../../services/processes.service';
import { Process } from '../../../../models'


@Component({
  selector: 'add-process',
  styleUrls: [('./add-process.component.scss')],
  templateUrl: './add-process.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AddProcess implements OnInit {

  allProcesses: Process[];
  selectedProcess: Process;

  constructor(
    private activeModal: NgbActiveModal,
    private processesService: ProcessesService
  ) {}

  ngOnInit() {
    this.loadAllProcesses();
  }

  private loadAllProcesses(): void {
    this.processesService.getList({}).subscribe(
      processes => {
        this.allProcesses = processes;
      },
      err => console.error(err),
    );
  }

  processFormatter(process: Process): string {
    return process.identifier;
  }

  closeModal() {
    this.activeModal.close();
  }

  resolveModal() {
    this.activeModal.close(
      this.selectedProcess
    );
  }
}
