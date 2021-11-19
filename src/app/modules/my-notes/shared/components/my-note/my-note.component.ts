import { Component, Input, OnChanges } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';
import { MyNoteUi } from 'src/app/shared/models/my-note';

@Component({
  selector: 'app-my-note',
  templateUrl: './my-note.component.html',
  styleUrls: ['./my-note.component.scss'],
})
export class MyNoteComponent implements OnChanges {
  get fontSize() {
    return this.configServ.fontSize;
  }
  @Input() data: MyNoteUi;
  @Input() isFullPage;
  @Input() showTitle: boolean;
  border;
  constructor(private configServ: ConfigService) { }

  ngOnChanges() {
    this.border = this.isFullPage ? this.data.c2 : '';
  }

}
