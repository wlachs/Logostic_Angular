import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '../../services/image-service/image.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

  public imagesLoaded: Boolean = false;
  private images: {name: string, file: File}[] = [];
  private encoded: number = 0;

  constructor(private router: Router, private imageService: ImageService) { }

  ngOnInit() { }

  /**
   * Handle uploaded images from the button side
   * @param message Event triggered by the buttons
   */
  checkImages(message: [{name: string, file: File}]) {
    if (message === null) {
      this.imagesLoaded = false;
    }
    else {
      this.imagesLoaded = true;
    }

    this.images = message;
  }

  /**
   * Convert the given file to base64 and add it to the sessionstorage
   * @param key Key string for sessionstorage
   * @param file Encodable file
   */
  getBase64(key: string, file: File) {
    return new Promise( (resolve, reject) => {
      var reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        sessionStorage.setItem(key, reader.result);
        resolve(key);
      };

      reader.onerror = err => reject(err);
    });
 }

 /**
  * Encode the uploaded files to base64 in the sessionstorage
  */
  encodeImages() {
    this.encoded = 0;

    this.images.forEach(image => {
      if (sessionStorage.getItem(image.name)) {
        this.navigate();
      }
      else if (image.file.type.indexOf('svg')) { // SVG resize not supported
        this.getBase64(image.name, image.file)
          .then( () => this.navigate());
      }
      else {
        this.imageService.resizeImage(image.file)
          .then( (resizedImage: File) => this.getBase64(image.name, resizedImage))
          .then( () => this.navigate());
      }
    });
  }

  /**
   * Check if all the requirements are met to navigate to the next page
   */
  navigate() {
    this.encoded++;

    if (this.encoded === this.images.length) {
      this.router.navigate(['/editor']);
    }
  }
}
