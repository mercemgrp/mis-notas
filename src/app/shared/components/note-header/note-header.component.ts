
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonBackButtonDelegate, IonSegment } from '@ionic/angular';
import { NoteActionButtons } from '../../constants/note-action-buttons';
import { NoteAction } from '../../constants/note-action';
import { NotesStatus } from '../../constants/notes-status';

@Component({
  selector: 'app-note-header',
  templateUrl: './note-header.component.html',
  styleUrls: ['./note-header.component.scss'],
})
export class NoteHeaderComponent implements OnInit {
  @ViewChild(IonSegment) segment: IonSegment;
  @ViewChild(IonBackButtonDelegate) backButton: IonBackButtonDelegate;
  @Input() notesStatus: NotesStatus;
  @Input() action: NoteAction;
  @Input() loading: boolean;
  @Input() showToolbarImage: boolean;
  @Output() backButtonPressedEv = new EventEmitter();
  @Output() clickNoteToolEv = new EventEmitter<number>();

  actionButtons = NoteActionButtons;
  status = NotesStatus;
  actions = NoteAction;
  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.setUIBackButtonAction();
    });
  }


  emitAction(id) {
    this.clickNoteToolEv.emit(id);
  }

  setUIBackButtonAction() {
    this.backButton.onClick = () => {
      this.backButtonPressedEv.next();
    };
  }


}
