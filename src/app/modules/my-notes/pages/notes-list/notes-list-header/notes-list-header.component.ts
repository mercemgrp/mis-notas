
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IonSegment, MenuController } from '@ionic/angular';
import { NoteActionButtons } from 'src/app/shared/constants/note-action-buttons';
import { NotesStatus } from 'src/app/shared/constants/notes-status';
import { ThemeUi } from 'src/app/shared/models/configuration-ui';

@Component({
  selector: 'app-notes-list-header',
  templateUrl: './notes-list-header.component.html',
  styleUrls: ['./notes-list-header.component.scss'],
})
export class NotesListHeaderComponent implements OnInit, OnChanges {
  @ViewChild(IonSegment) segment: IonSegment;
  @Input() hide: boolean;
  @Input() loading: boolean;
  @Input() selectedLenght: number;
  @Input() notesStatus: NotesStatus;
  @Input() themes: ThemeUi[] = [];
  @Input() selectedTheme: ThemeUi;
  @Input() showThemesToolbar: boolean;
  @Output() filterByThemeEv = new EventEmitter<string>();
  @Output() clickNoteToolEv = new EventEmitter<number>();
  @Output() showFiterToolbarEv = new EventEmitter<boolean>();
  title = 'Mis notas';
  status = NotesStatus;
  themeSelected: ThemeUi;
  showFilterToolbar = false;
  actionButtons = NoteActionButtons;
  constructor(private menu: MenuController) {}

  ngOnInit() {
    this.showFilterToolbar = this.showThemesToolbar;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.selectedTheme?.currentValue) {
      this.segment.value = this.selectedTheme ? 'theme_' + this.selectedTheme.themeId : 'theme_default';
    }
  }

  emitAction(id) {
    this.clickNoteToolEv.emit(id);
  }

  onSwitchFilter() {
    this.showFilterToolbar = !this.showFilterToolbar;
    this.showFiterToolbarEv.emit(this.showFilterToolbar);
  }

  onOpenMainMenu() {
    this.menu.enable(true);
    this.menu.open('mainMenu');
  }

  filterByTheme(event) {
    const themeId = event.detail.value ===  'theme_default' ? null : event.detail.value.split('theme_')[1];
    this.filterByThemeEv.emit(themeId);
  }

  clearTheme() {
    this.segment.value = 'theme_default';
  }

}
