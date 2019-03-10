import { Component } from '@angular/core';
import { Repository } from '../../../@core/models';
import { ActivatedRoute, Router } from '@angular/router';

import 'style-loader!angular2-toaster/toaster.css';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';

import { ManageComponent } from '../manage/manage.component'
import { RepositoriesService } from '../../../@core/data/repositories.service';
import { RepositoriesTypesSettingsService } from '../../../@core/data/repositories-types-settings.service';
import { NbToastrService } from '@nebular/theme';


@Component({
  selector: 'ngx-edit-repository',
  templateUrl: './edit.component.html',
})
export class EditComponent extends ManageComponent {

  constructor(
    protected service: RepositoriesService,
    protected settingsService: RepositoriesTypesSettingsService,
    protected router: Router,
    protected toastService: NbToastrService,
    private route: ActivatedRoute
  ) {
    super(service, settingsService, router, toastService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadRepository();
  }

  protected loadRepository() {
    this.route.paramMap.subscribe(params => {
      this.service.get(params.get('id')).subscribe((repository: Repository) => {
        this.repository = repository;
      })
    })
  }

  protected update() {
    this.service.update(this.repository.id, this.repository).subscribe((repository:  Repository) => {
      this.showToast(
        'Updated',
        'The new repository has been successfully updated',
        NbToastStatus.SUCCESS,
        2500,
      );
    }, (error) => {
      this.showToast(
        error.error.message,
        error.error.detail,
        NbToastStatus.DANGER,
        3000,
      );
    });
  }

}
