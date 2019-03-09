import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RepositoriesService } from '../../../@core/data/repositories.service';
import { RepositoriesTypesSettingsService } from '../../../@core/data/repositories-types-settings.service';
import { Repository } from '../../../@core/models';


import 'style-loader!angular2-toaster/toaster.css';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';


@Component({
  selector: 'ngx-add-repository',
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {

  protected repository: Repository = new Repository();
  protected settings: object;
  protected types: string[];

  constructor(
    private service: RepositoriesService,
    private settingsService: RepositoriesTypesSettingsService,
    private router: Router,
    private toastService: NbToastrService,
  ) {}

  ngOnInit(): void {
    this.settingsService.get().subscribe((settings: object) => {
      this.settings = settings;
      this.types = Object.keys(this.settings);
    });
  }

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

  private showToast(title, body, status, time) {
    const config = {
      status: status,
      destroyByClick: true,
      duration: time,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
      preventDuplicates: false,
    };

    this.toastService.show(body, title, config);
  }
}
