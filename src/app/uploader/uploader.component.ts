import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { 
  }

  navigate() {
    /*if (this.imageLoaded && this.logoLoaded) {
      setTimeout(() => {
        this.router.navigate(['/editor']);
      }, 500);
    }*/
  }
}
