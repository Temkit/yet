import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-s-category',
  templateUrl: './s-category.component.html',
  styleUrls: ['./s-category.component.css']
})
export class SCategoryComponent implements OnInit {

  ready;

  objectConfig = { specification: {} };
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.ready = this.route.queryParams.pipe(
      map(params => {
        this.objectConfig['specification'] = JSON.parse(
          JSON.stringify(params.item)
        );
        this.objectConfig['isChild'] = false;


        return JSON.stringify(this.objectConfig);
      })
    );
  }

  save(z) {
    console.log('ALors ->', z);
  }
}
