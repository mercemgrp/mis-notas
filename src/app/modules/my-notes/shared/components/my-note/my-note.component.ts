import { Component, Input, OnInit } from '@angular/core';
import { MyNote } from 'src/app/shared/models/my-note';

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
