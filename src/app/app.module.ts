import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { EditorComponent } from './views/editor/editor.component';
import { UploaderComponent } from './views/uploader/uploader.component';
import { PickerButtonsComponent } from './views/uploader/picker-buttons/picker-buttons.component';
import { FirstUppercasePipe } from './views/uploader/picker-buttons/first-uppercase.pipe';
import { ImageService } from './services/image-service/image.service';

const routes: Routes = [
  { path: '', redirectTo: '/uploader', pathMatch: 'full' },
  { path: 'uploader', component: UploaderComponent },
  { path: 'editor', component: EditorComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    UploaderComponent,
    PickerButtonsComponent,
    FirstUppercasePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  bootstrap: [AppComponent],
  providers: [ImageService]
})
export class AppModule { }
