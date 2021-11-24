
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild } from '@angular/core';
import { IonSegment, IonSegmentButton, MenuController } from '@ionic/angular';
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
  get segmentElement() {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    return this.segment && this.segment['el'];
  }
  title = 'Mis notas';
  status = NotesStatus;
  actionButtons = NoteActionButtons;
  showedThemeToolbar = false;
  constructor(private menu: MenuController) {}

  ngOnInit() {
    this.showedThemeToolbar = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.showThemesToolbar || changes?.selectedLenght || changes?.hide) {
      this.showedThemeToolbar = this.showThemesToolbar &&  !this.selectedLenght && !this.hide;
    }
    if (changes?.selectedTheme || changes?.themes) {
      this.focusOnSegment();
    }
  }

  emitAction(id) {
    this.clickNoteToolEv.emit(id);
  }

  onSwitchFilter() {
    this.showedThemeToolbar = !this.showedThemeToolbar;
    this.showFiterToolbarEv.emit(this.showedThemeToolbar);
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
      this.segment.value = this.selectedTheme ? 'theme_' + this.selectedTheme.themeId : 'theme_default';
        const checkedElem: any = this.segmentElement &&
          this.segmentElement.getElementsByClassName('segment-button-checked')[0] as HTMLElement;
        if (checkedElem) {
          checkedElem.scrollIntoView({behavior: 'smooth', inline: 'center', block: 'center'});
        }
    }, 250);
  }

}
