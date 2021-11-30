
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
  lastActionId;
  buttons = [];
  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.setUIBackButtonAction();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.createButtons();
  }

  emitAction(id) {
    this.lastActionId = id;
    this.clickNoteToolEv.emit(id);
  }

  setUIBackButtonAction() {
    this.backButton.onClick = () => {
      this.backButtonPressedEv.next();
    };
  }


  hide(id) {
    return false;
  }

  private createButtons() {
    if (this.isArchived) {
      this.buttons = [{
        type: this.actionButtons.switchColorSelector,
        icon: 'color-palette',
        disabled: this.loading
      }, {
        type: this.actionButtons.unarchive,
        icon: 'push',
        disabled: this.loading|| this.showedModal
      }, {
        type: this.actionButtons.delete,
        icon: 'trash',
        disabled: this.loading|| this.showedModal
      }];
    } else {
      this.buttons = [{
        type: this.actionButtons.save,
        icon: 'save',
        hidden: this.actions.view === this.action,
        class: !this.showedModal ? 'important-button' : '',
        disabled: this.loading|| this.showedModal
      }, {
        type: this.actionButtons.edit,
        icon: 'pencil',
        hidden: this.actions.view !== this.action,
        class: !this.showedModal ? 'important-button' : '',
        disabled: this.loading|| this.showedModal
      }, {
        type: this.actionButtons.switchColorSelector,
        icon: 'color-palette',
        disabled: this.loading || (this.showedModal && this.lastActionId !== this.actionButtons.switchColorSelector),
        class: this.showedModal && this.lastActionId === this.actionButtons.switchColorSelector ? 'selected-button' : ''
      },{
        type: this.actionButtons.toggleCalendar,
        icon: 'notifications',
        disabled: this.loading || (this.showedModal && this.lastActionId !== this.actionButtons.toggleCalendar),
        class: this.showedModal && this.lastActionId === this.actionButtons.toggleCalendar ? 'selected-button' : ''
      }, {
        type: this.actionButtons.archive,
        icon: 'archive',
        hidden: false,
        disabled: this.loading || this.showedModal
      },{
        type: this.actionButtons.delete,
        icon: 'trash',
        hidden: this.action === this.actions.create,
        disabled: this.loading || this.showedModal
      }];
    }
  }

}
