import { Component, OnInit } from '@angular/core';
import { RepositoriesService } from '../../../@core/data/repositories.service';
import { Repository } from '../../../@core/models';
import { Router } from '@angular/router';


@Component({
  selector: 'ngx-repositories-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {

  protected repositories: Repository[];

  constructor(private service: RepositoriesService, private router: Router) {}

  ngOnInit() {
    this.service.getList().subscribe((repositories:  Repository[]) => {
      this.repositories  =  repositories;
    });
  }

  protected redirectToDetail(id: number) {
    this.router.navigate(['/pages/repository/' + id]);
  }

}
