import { Component } from '@angular/core';
import { Repository } from '../../../@core/models';

import 'style-loader!angular2-toaster/toaster.css';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';

import { ManageComponent } from '../manage/manage.component'


@Component({
  selector: 'ngx-add-repository',
  templateUrl: './add.component.html',
})
export class AddComponent extends ManageComponent {

  protected create() {
    this.service.create(this.repository).subscribe((repository:  Repository) => {
      this.showToast(
        'Registered',
        'The new repository has been successfully registered',
        NbToastStatus.SUCCESS,
        2500,
      );
      setTimeout(() => {
        this.router.navigate(['/pages/repositories']);
      }, 3000);
    }, (error) => {
      this.showToast(
        error.error.message,
        error.error.detail,
        NbToastStatus.DANGER,
        3000,
      );
    });
  }

  protected preloadSettings() {
    const settings = {};
    for (const setting of this.settings[this.repository.type]) {
      settings[setting] = '';
    }
    this.repository.configurations = settings;
  }

}
