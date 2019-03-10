import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RepositoriesService } from '../../../@core/data/repositories.service';
import { RepositoriesTypesSettingsService } from '../../../@core/data/repositories-types-settings.service';
import { Repository } from '../../../@core/models';

import 'style-loader!angular2-toaster/toaster.css';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';


@Component({})
export class ManageComponent implements OnInit {

  protected repository: Repository = new Repository();
  protected settings: object;
  protected types: string[];

  constructor(
    protected service: RepositoriesService,
    protected settingsService: RepositoriesTypesSettingsService,
    protected router: Router,
    protected toastService: NbToastrService,
  ) {}

  ngOnInit(): void {
    this.settingsService.get().subscribe((settings: object) => {
      this.settings = settings;
      this.types = Object.keys(this.settings);
    });
  }

  protected showToast(title, body, status, time) {
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
