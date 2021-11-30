
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IonSegment, MenuController } from '@ionic/angular';
import { NoteActionButtons } from 'src/app/shared/constants/note-action-buttons';
import { NotesStatus } from 'src/app/shared/constants/notes-status';
import { ThemeUi } from 'src/app/shared/models/configuration-ui';

@Component({
  selector: 'app-notes-list-header',
  templateUrl: './notes-list-header.component.html',
  styleUrls: ['./notes-list-header.component.scss'],
})
export class NotesListHeaderComponent implements OnChanges {
  @ViewChild(IonSegment) segment: IonSegment;
  @Input() hide: boolean;
  @Input() loading: boolean;
  @Input() selectedLenght: number;
  @Input() notesStatus: NotesStatus;
  @Input() themes: ThemeUi[] = [];
  @Input() selectedTheme: ThemeUi;
  @Input() showThemesToolbar: boolean;
  @Input() showedModal: boolean;
  @Output() filterByThemeEv = new EventEmitter<string>();
  @Output() clickNoteToolEv = new EventEmitter<number>();
  @Output() showFiterToolbarEv = new EventEmitter<boolean>();

  get showNotesToolbar() {
    return this.selectedLenght > 0;
  }
  get segmentElement() {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    return this.segment && this.segment['el'];
  }
  title = 'Mis notas';
  status = NotesStatus;
  actionButtons = NoteActionButtons;
  constructor(private menu: MenuController) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.selectedTheme || changes?.themes) {
      this.focusOnSegment();
    }
  }

  emitAction(id) {
    this.clickNoteToolEv.emit(id);
  }

  onSwitchFilter() {
    this.showFiterToolbarEv.emit(!this.showThemesToolbar);
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

  private focusOnSegment() {
    setTimeout(() => {
      if (this.segment) {
        this.segment.value = this.selectedTheme ? 'theme_' + this.selectedTheme.themeId : 'theme_default';
        const checkedElem: any = this.segmentElement &&
          this.segmentElement.getElementsByClassName('segment-button-checked')[0] as HTMLElement;
        if (checkedElem) {
          checkedElem.scrollIntoView({behavior: 'smooth', inline: 'center', block: 'center'});
        }
      }
    }, 250);
  }

}
