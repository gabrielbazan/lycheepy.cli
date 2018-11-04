import { Component, OnInit } from '@angular/core';
import {RepositoriesService} from '../../../@core/data/repositories.service';
import {Repository} from '../../../@core/models';

@Component({
  selector: 'ngx-repositories-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {

  protected repositories: Repository[];

  constructor(private service: RepositoriesService) {}

  ngOnInit() {
    this.service.getList().subscribe((repositories:  Repository[]) => {
      this.repositories  =  repositories;
    });
  }
}
