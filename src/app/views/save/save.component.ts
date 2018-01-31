import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.css']
})
export class SaveComponent implements OnInit {

  public imageSource: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.imageSource = this.route.params['_value']['data'];
  }

}
