import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {
  imageLoaded: boolean = false;
  logoLoaded: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() { 
    this.navigate();
  }

  uploadImage(name: string) {
    if(document.getElementById(name).classList.contains('disabled')) {
      return;
    }

    let uploadFile = document.createElement('input');
    uploadFile.setAttribute('type', 'file');
    uploadFile.accept = "image/*";
    document.body.appendChild(uploadFile);
    uploadFile.click();
    document.body.removeChild(uploadFile);

    let handleFiles = () => {
      let image = uploadFile.files[0];
      this.getBase64(name, image);
    };
    uploadFile.addEventListener("change", handleFiles, false);
  }

  getBase64(key: string, file: File) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      sessionStorage.setItem(key, reader.result);
      this.navigate();
    };
 }

 updateVariables() {
  if (sessionStorage.getItem('image')) {
    this.imageLoaded = true;
  }
  if (sessionStorage.getItem('logo')) {
    this.logoLoaded = true;
  }
}

  navigate() {
    this.updateVariables();
    if (this.imageLoaded && this.logoLoaded) {
      setTimeout(() => {
        this.router.navigate(['/editor']);
      }, 500);
    }
  }
}
