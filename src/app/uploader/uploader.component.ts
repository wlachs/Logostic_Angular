import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

  private imagesLoaded: Boolean = false;

  constructor(private router: Router) { }

  ngOnInit() { }

  checkImages(message: {name: String, value: Boolean}) {
    this.imagesLoaded = message.value;
  }

  navigate() {
    this.router.navigate(['/editor']);
  }
}
