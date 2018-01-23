import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-picker-button',
  templateUrl: './picker-button.component.html',
  styleUrls: ['./picker-button.component.css']
})
export class PickerButtonComponent implements OnInit {

  @Input() checkPosition;
  @Input() source;
  @Output() uploadEvent: EventEmitter<{name: String, value: Boolean}> = new EventEmitter();

  loaded: boolean = false;

  constructor() { }

  ngOnInit() {
    this.updateVariables();
  }

  uploadImage() {
    if(document.getElementById(this.source).classList.contains('disabled')) {
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
      this.getBase64(this.source, image);
    };
    uploadFile.addEventListener("change", handleFiles, false);
  }

  updateVariables() {
    if (sessionStorage.getItem(this.source)) {
      this.loaded = true;
    }

    this.uploadEvent.emit({name: this.source, value: this.loaded});
  }

  getBase64(key: string, file: File) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      sessionStorage.setItem(key, reader.result);
      this.updateVariables();
    };
 }

}
