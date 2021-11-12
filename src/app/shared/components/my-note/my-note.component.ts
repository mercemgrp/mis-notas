import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MyNote } from '../../models/my-note';

@Component({
  selector: 'app-my-note',
  templateUrl: './my-note.component.html',
  styleUrls: ['./my-note.component.scss'],
})
export class MyNoteComponent implements OnInit {
  @Input() data: MyNote;
  @Input() isFullPage;
  constructor() { }

  ngOnInit() {}

}
