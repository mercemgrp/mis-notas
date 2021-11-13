
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { IonSegment, MenuController } from '@ionic/angular';
import { NoteActionButtons } from 'src/app/shared/constants/note-action-buttons';
import { NotesStatus } from 'src/app/shared/constants/notes-status';

@Component({
  selector: 'app-notes-list-header',
  templateUrl: './notes-list-header.component.html',
  styleUrls: ['./notes-list-header.component.scss'],
})
export class NotesListHeaderComponent {
  @ViewChild(IonSegment) segment: IonSegment;
  @Input() hide: boolean;
  @Input() loading: boolean;
  @Input() selectedLenght: number;
  @Input() notesStatus: NotesStatus;
  @Input() colors = [];
  @Input() selectedColor;
  @Output() filterByColorEvEv = new EventEmitter<string>();
  @Output() clickNoteToolEv = new EventEmitter<number>();
  title = 'Mis notas';
  status = NotesStatus;
  colorSelected = '';
  showFilterToolbar = false;
  actionButtons = NoteActionButtons;
  constructor(private menu: MenuController) {}

  emitAction(id) {
    this.clickNoteToolEv.emit(id);
  }

  onSwitchFilter() {
    this.showFilterToolbar = !this.showFilterToolbar;
  }

  onOpenMainMenu() {
    this.menu.enable(true);
    this.menu.open('mainMenu');
  }

  filterByColor(event) {
    this.colorSelected = event.detail.value ===  'c_default' ? '' : this.colors[event.detail.value.split('c_')[1]];
    this.filterByColorEvEv.emit(this.colorSelected);
  }

  selectColor(colorC) {
    if (!colorC) {
      this.segment.value = 'c_default';
    } else {
      this.segment.value = 'c_' + this.colors.findIndex(c => c.id === colorC.id);
    }
  }

}
