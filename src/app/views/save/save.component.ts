import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session-service/session.service';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.css']
})
export class SaveComponent implements OnInit {

  public imageSource: string;

  constructor(private sessionService: SessionService) { }

  ngOnInit() {
    this.imageSource = this.sessionService.getExportableImage();
  }

}
