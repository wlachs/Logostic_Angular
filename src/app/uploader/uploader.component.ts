import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

  private imageLoaded: Boolean = false;
  private logoLoaded: Boolean = false;

  constructor(private router: Router) { }

  ngOnInit() { }

  checkImages(message: {name: String, value: Boolean}) {
    switch (message.name){
      case 'image': this.imageLoaded = message.value; break;
      case 'logo': this.logoLoaded = message.value; break;
      default: break;
    }

    this.navigate();
  }

  navigate() {
    if (this.imageLoaded && this.logoLoaded) {
      setTimeout(() => {
        this.router.navigate(['/editor']);
      }, 500);
    }
  }
}
