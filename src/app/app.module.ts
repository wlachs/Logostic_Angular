import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { UploaderComponent } from './uploader/uploader.component';
import { PickerButtonsComponent } from './uploader/picker-buttons/picker-buttons.component';
import { FirstUppercasePipe } from './uploader/picker-buttons/first-uppercase.pipe';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
