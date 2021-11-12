
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { IonSegment, MenuController } from '@ionic/angular';
import { NoteActionButtons } from 'src/app/shared/constants/note-action-buttons';
import { COLORS } from 'src/app/shared/constants/colors';

@Component({
  selector: 'app-notes-list-header',
  templateUrl: './notes-list-header.component.html',
  styleUrls: ['./notes-list-header.component.scss'],
})
export class NotesListHeaderComponent implements OnInit {
  @ViewChild(IonSegment) segment: IonSegment;
  @Input() title = 'Mis notas';
  @Input() hide: boolean;
  @Input() loading: boolean;
  @Input() selectedLenght: number;
  @Input() typeNotesSelected: number;
  @Output() filterByColorEvEv = new EventEmitter<string>();
  @Output() clickNoteToolEv = new EventEmitter<number>();
  colors = [];
  showFilterToolbar = false;
  actionButtons = NoteActionButtons;
  constructor(private menu: MenuController) {}

  ngOnInit() {
    const entries = Object.entries(COLORS);
    this.colors = entries.map(value =>value[1] );
  }


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

  filterByColor(color) {
    this.filterByColorEvEv.emit(color.detail.value);
  }

}
