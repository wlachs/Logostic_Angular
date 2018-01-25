import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-picker-buttons',
  templateUrl: './picker-buttons.component.html',
  styleUrls: ['./picker-buttons.component.css']
})
export class PickerButtonsComponent implements OnInit {

  @Output() uploadEvent: EventEmitter<{name: String, value: Boolean}> = new EventEmitter();

  buttons: [{name: string, checkPosition: string, uploaded: boolean}] = [
    {
      name: 'image',
      checkPosition: 'left',
      uploaded: undefined
    },
    {
      name: 'logo',
      checkPosition: 'right',
      uploaded: undefined
    }
  ];

  constructor() { }

  ngOnInit() {
    this.updateVariables();
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

  updateVariables() {
    for (let i = 0; i < this.buttons.length; i++) {
      if (sessionStorage.getItem(this.buttons[i].name)) {
        this.buttons[i].uploaded = true;
      } else {
        this.buttons[i].uploaded = false;
      }
    }

    let trues = 0;
    this.buttons.forEach( (button) => {
      trues += button.uploaded ? 1 : 0;
    });

    this.uploadEvent.emit({name: null, value: trues === this.buttons.length});
  }

  getBase64(key: string, file: File) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      sessionStorage.setItem(key, reader.result);
      this.updateVariables();
    };
 }

  delete(name: string) {
    sessionStorage.removeItem(name);
      setTimeout(() => {
        this.updateVariables();
    }, 100);
 }
 
}
