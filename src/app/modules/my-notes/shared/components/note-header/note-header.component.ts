
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IonBackButtonDelegate, IonSegment } from '@ionic/angular';
import { NoteAction } from 'src/app/shared/constants/note-action';
import { NoteActionButtons } from 'src/app/shared/constants/note-action-buttons';
import { NotesStatus } from 'src/app/shared/constants/notes-status';


@Component({
  selector: 'app-note-header',
  templateUrl: './note-header.component.html',
  styleUrls: ['./note-header.component.scss'],
})
export class NoteHeaderComponent implements OnInit, OnChanges{
  @ViewChild(IonSegment) segment: IonSegment;
  @ViewChild(IonBackButtonDelegate) backButton: IonBackButtonDelegate;
  @Input() isArchived: boolean;
  @Input() action: NoteAction;
  @Input() loading: boolean;
  @Input() showToolbarImage: boolean;
  @Input() showedModal: boolean;
  @Output() backButtonPressedEv = new EventEmitter();
  @Output() clickNoteToolEv = new EventEmitter<number>();

  actionButtons = NoteActionButtons;
  status = NotesStatus;
  actions = NoteAction;
  buttons = [];
  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.setUIBackButtonAction();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isArchived || changes.action) {
      this.createButtons();
    }
  }

  emitAction(id) {
    this.clickNoteToolEv.emit(id);
  }

  setUIBackButtonAction() {
    this.backButton.onClick = () => {
      this.backButtonPressedEv.next();
    };
  }

  private createButtons() {
    if (this.isArchived) {
      this.buttons = [{
        type: this.actionButtons.switchColorSelector,
        icon: 'color-palette'
      }, {
        type: this.actionButtons.unarchive,
        icon: 'push'
      }, {
        type: this.actionButtons.delete,
        icon: 'trash'
      }];
    } else {
      this.buttons = [{
        type: this.actionButtons.archive,
        icon: 'archive',
        hidden: this.actions.create === this.action
      }, {
        type: this.actionButtons.save,
        icon: 'save',
        hidden: this.actions.view === this.action,
        class: 'important-button'
      }, {
        type: this.actionButtons.edit,
        icon: 'pencil',
        hidden: this.actions.view !== this.action,
        class: 'important-button'
      }, {
        type: this.actionButtons.switchColorSelector,
        icon: 'color-palette'
      },{
        type: this.actionButtons.toggleCalendar,
        icon: 'notifications'
      }, {
        type: this.actionButtons.delete,
        icon: 'trash',
        hidden: this.action === this.actions.create
      }];
    }
  }

}
