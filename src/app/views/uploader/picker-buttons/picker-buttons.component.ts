import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-picker-buttons',
  templateUrl: './picker-buttons.component.html',
  styleUrls: ['./picker-buttons.component.css']
})
export class PickerButtonsComponent implements OnInit {

  @Output() uploadEvent: EventEmitter<[{name: string, file: File}]> = new EventEmitter();

  buttons: {name: string, checkPosition: string, uploaded: boolean, file: File}[] = [
    {
      name: 'image',
      checkPosition: 'left',
      uploaded: undefined,
      file: undefined
    },
    {
      name: 'logo',
      checkPosition: 'right',
      uploaded: undefined,
      file: undefined
    }
  ];

  constructor() { }

  ngOnInit() {
    this.updateVariables();
  }

  /**
   * Handle click on button to upload image file
   * @param name Name of the clicked element
   */
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
      this.buttons[this.getIdByName(name)].file = image;
      this.updateVariables();
    };
    uploadFile.addEventListener("change", handleFiles, false);
  }

  /**
   * Update variables to match current state
   */
  updateVariables() {
    for (let i = 0; i < this.buttons.length; i++) {
      if (sessionStorage.getItem(this.buttons[i].name) || this.buttons[i].file !== undefined) {
        this.buttons[i].uploaded = true;
      } else {
        this.buttons[i].uploaded = false;
      }
    }

    let trues = 0;
    this.buttons.forEach( (button) => {
      trues += button.uploaded ? 1 : 0;
    });

    if (trues === this.buttons.length) {
      let result = [];

      this.buttons.forEach( button => {
        result.push({name: button.name, file: button.file});
      });

      this.uploadEvent.emit(result as [{name: string, file: File}]);
    }
    else {
      this.uploadEvent.emit(null);
    }
  }

  /**
   * Handle delete button click,
   * remove old file and clear sessionstorage
   * @param name Name of the clicked element
   */
  delete(name: string) {
    sessionStorage.removeItem(name);
    this.buttons[this.getIdByName(name)].file = undefined;

    setTimeout(() => {
        this.updateVariables();
    }, 100);
 }

 /**
  * Return the ID of the button specified by name
  * - should be refactored to a dictionary -
  * @param name Name of the desired element
  */
 getIdByName(name: string) {
   for (let i = 0; i < this.buttons.length; i++) {
     if (this.buttons[i].name === name) {
       return i;
     }
   }
   return null;
 }
}
