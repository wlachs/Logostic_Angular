import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session-service/session.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.css']
})
export class SaveComponent implements OnInit {

  public imageSource: SafeUrl;

  constructor(private sessionService: SessionService, private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    window.onresize = () => {};
    this.imageSource = this.domSanitizer.bypassSecurityTrustUrl(this.sessionService.getExportableImage());
  }

}
