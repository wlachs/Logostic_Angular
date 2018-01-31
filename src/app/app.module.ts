import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ng2PicaModule } from 'ng2-pica';

import { AppComponent } from './app.component';
import { EditorComponent } from './views/editor/editor.component';
import { UploaderComponent } from './views/uploader/uploader.component';
import { PickerButtonsComponent } from './views/uploader/picker-buttons/picker-buttons.component';
import { FirstUppercasePipe } from './views/uploader/picker-buttons/first-uppercase.pipe';
import { ImageService } from './services/image-service/image.service';
import { SaveComponent } from './views/save/save.component';

const routes: Routes = [
  { path: '', redirectTo: '/uploader', pathMatch: 'full' },
  { path: 'uploader', component: UploaderComponent },
  { path: 'editor', component: EditorComponent },
  { path: 'save', component: SaveComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    UploaderComponent,
    PickerButtonsComponent,
    FirstUppercasePipe,
    SaveComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    Ng2PicaModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  bootstrap: [AppComponent],
  providers: [ImageService]
})
export class AppModule { }
