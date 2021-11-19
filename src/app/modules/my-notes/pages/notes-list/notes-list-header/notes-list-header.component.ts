
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { IonSegment, MenuController } from '@ionic/angular';
import { NoteActionButtons } from 'src/app/shared/constants/note-action-buttons';
import { NotesStatus } from 'src/app/shared/constants/notes-status';
import { ThemeUi } from 'src/app/shared/models/configuration-ui';

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
  @Input() themes: ThemeUi[] = [];
  @Input() selectedColor;
  @Output() filterByColorEvEv = new EventEmitter<ThemeUi>();
  @Output() clickNoteToolEv = new EventEmitter<number>();
  title = 'Mis notas';
  status = NotesStatus;
  colorSelected: ThemeUi;
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
    this.colorSelected = event.detail.value ===  'c_default' ? null : this.themes[event.detail.value.split('c_')[1]];
    this.filterByColorEvEv.emit(this.colorSelected);
  }

  clearTheme() {
    this.segment.value = 'c_default';
  }

}
