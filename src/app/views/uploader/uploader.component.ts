import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ng2PicaService } from 'ng2-pica';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

  imagesLoaded: Boolean = false;

  constructor(private router: Router, private ng2PicaService: Ng2PicaService) { }

  ngOnInit() { }

  checkImages(message: {name: String, value: Boolean}) {
    this.imagesLoaded = message.value;
  }

  navigate() {
    this.router.navigate(['/editor']);
  }
}
