import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NoteActionButtons } from 'src/app/shared/constants/note-action-buttons';
import { HEADER_HEIGHT, THEMES_MENU_HEIGHT } from 'src/app/shared/constants/header-px';
import { MyNoteUi } from 'src/app/shared/models/my-note';
import { MyNotesService } from 'src/app/core/services/my-notes.service';
import { NotesStatus } from 'src/app/shared/constants/notes-status';
import { NotesListHeaderComponent } from './notes-list-header/notes-list-header.component';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ThemeUi } from 'src/app/shared/models/configuration-ui';
import { ConfigService } from 'src/app/core/services/config.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { tap } from 'rxjs/operators';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-notes-list',
  templateUrl: 'notes-list.page.html',
  styleUrls: ['notes-list.page.scss']
})
export class NotestListPage implements OnInit, OnDestroy {
  @ViewChild('content') content: IonContent;
  @ViewChild(ModalComponent) optionsSelectorModalCmp: ModalComponent;
  @ViewChild(NotesListHeaderComponent) headerComp: NotesListHeaderComponent;
  @ViewChildren('noteElem') notesComp: QueryList<ElementRef>;
  get oneSelected() {
    return this.activedSelected.length === 1;
  }
  get activedSelected() {
    return this.myNotesActived.filter(note => note.selected);
  }
  get hideArchived() {
    return this.config.hideArchived;
  }
  private get contentElement() {
    return this.content && this.content['el'];
  }
  notesStatus: NotesStatus = NotesStatus.active;
  scrollPosition = 0;
  scrollingDown = false;
  showFabIcon = false;
  myNotesArchived: MyNoteUi[] = [];
  myNotesActived: MyNoteUi[] = [];
  loading = false;
  showThemeSelector = false;
  themeSelected: ThemeUi;
  showedThemeToolbar: boolean;
  numberOfNotesSelected = 0;
  actionButtons = NoteActionButtons;
  themes: ThemeUi[]= [];
  pageLoaded = false;
  viewIsListMode: boolean;
  firstItemInView: string;
  private ngUnsubscribe = new Subject<void>();
  constructor(
    private router: Router,
    private myNotesService: MyNotesService,
    private utilsServ: UtilsService,
    private config: ConfigService) {}

  ngOnInit() {
    this.viewIsListMode = this.config.viewIsListMode;
    this.config.viewModeChanges$
    .pipe(tap(() => this.viewIsListMode = this.config.viewIsListMode))
    .subscribe();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ionViewWillEnter() {
    this.content.scrollEvents = false;
    this.pageLoaded = false;
    this.loading = true;
    this.scrollingDown = false;
    this.themeSelected = this.config.selectedTheme;
    this.updateData(true);
    this.unselectNotes();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      const needScroll = this.scrollIntoNote();
      setTimeout(() => {
        this.pageLoaded = true;
        this.content.scrollEvents = true;
        this.loading =  false;
        this.getFabIconState();
        this.showedThemeToolbar = this.config.showThemesToolbar;
      }, needScroll ? 1000 : 0);
    });
  }

  ionViewWillLeave() {
    this.showFabIcon = false;
    this.content.scrollEvents = false;
  }

  scrollIntoNote() {
    if(this.firstItemInView === undefined) {
      return false;
    } else {
      const noteSelected = this.notesComp.find(
        note => note.nativeElement.classList.contains('note-' + this.firstItemInView))?.nativeElement;
      if (!noteSelected) {
        return false;
      }
      const notePosition = noteSelected.offsetTop;
      const notePositionEnd = notePosition + noteSelected.offsetHeight;
      const contentPosition = this.contentElement.offsetTop;
      const contentPositionEnd  = this.contentElement.offsetTop + this.contentElement.offsetHeight;
      const isInView = notePosition >= contentPosition && notePositionEnd <= contentPositionEnd;
      if (!isInView) {
        this.content.scrollByPoint(0, 0, 0).then(() => {
          this.content.scrollByPoint(0, notePosition - HEADER_HEIGHT - THEMES_MENU_HEIGHT, 500);
        });
        return true;
      }
      return false;
    }
  }

  onFireHeaderButtonAction(id) {
    switch (id) {
      case this.actionButtons.closeToolbar:
        this.closeToolbar();
        break;
      case this.actionButtons.switchAscendent:
        this.switch(true);
        break;
      case this.actionButtons.switchDescendent:
        this.switch(false);
        break;
      case this.actionButtons.edit:
        this.editNote();
        break;
      case this.actionButtons.switchColorSelector:
        this.onSwitchColorSelector();
        break;
      case this.actionButtons.delete:
        this.delete();
        break;
      case this.actionButtons.archive:
        this.archive();
        break;
      default:
        break;
    }
  }

  onFilterByThemeId(themeId: string) {
    if (themeId) {
      this.themeSelected = this.config.getThemeData(themeId);
    } else {
      this.themeSelected = null;
    }
    this.config.setThemeSelected(themeId);
    this.updateData(false);
    this.unselectNotes();
  }

  onChangesShowThemeToolbar(value) {
    this.showedThemeToolbar = value;
    this.config.setShowThemeToolbar(value);
  }

  unselectTheme() {
    this.themeSelected = null;
    this.updateData(false);
    this.unselectNotes();
    this.headerComp.clearTheme();
  }

  onSwitchColorSelector() {
    if (!this.showThemeSelector) {
      this.showThemeSelector = true;
    } else {
      this.optionsSelectorModalCmp.onHide();
    }
  }

  onCloseColorSelector() {
    this.showThemeSelector = false;
  }
  onViewNote(data: MyNoteUi) {
    if (this.activedSelected.length) {
      this.onSelectNote(data);
    } else {
      this.firstItemInView = data.id;
      this.router.navigate(['my-notes/view', data.id]);
    }
  }

  onAddNote() {
    this.firstItemInView = undefined;
    this.router.navigate(['my-notes/create', { themeId: this.themeSelected?.themeId || ''}]);
  }
  onScroll(e): void {
    if (!this.pageLoaded) {
      return;
    }
    console.log(e.detail.scrollTop);
    if (e.detail.scrollTop === 0) {
      this.scrollingDown = false;
      this.scrollPosition = e.detail.scrollTop;
      this.showFabIcon = true;
    } else if (
      this.scrollPosition < e.detail.scrollTop - HEADER_HEIGHT - (this.showedThemeToolbar ? THEMES_MENU_HEIGHT : 0) ||
      this.scrollPosition > e.detail.scrollTop + HEADER_HEIGHT + (this.showedThemeToolbar ? THEMES_MENU_HEIGHT : 0)
    ) {
      this.scrollingDown = this.scrollPosition < e.detail.scrollTop;
      this.scrollPosition = e.detail.scrollTop;
      this.showFabIcon = !this.scrollingDown;
    }
  }

  onSelectColor(colorId) {
    const theme = this.config.getThemeData(colorId);
    this.loading = true;
    const myNotes = this.activedSelected.map(elem => ({
      ...elem,
      ...theme
    }));
    this.myNotesService
      .save(myNotes)
      .then(() => this.updateData(true))
      .finally(() => {
        this.unselectNotes();
        this.optionsSelectorModalCmp.onHide();
        this.loading = false;
      });
  }

  onSelectNote( data: MyNoteUi) {
    data.selected = !data.selected;
  }
  private closeToolbar() {
    if (this.showThemeSelector) {
      this.onSwitchColorSelector();
      setTimeout(() => {
        this.unselectNotes();
      }, 350);
    } else {
      this.unselectNotes();
    }
  }

  private getFabIconState() {
    if (this.pageLoaded) {
      const numberOfNotes = this.myNotesActived.length + this.myNotesArchived.length;
      if (numberOfNotes && !this.showFabIcon) {
        this.showFabIcon = true;
      } else if(!numberOfNotes && this.showFabIcon) {
        this.showFabIcon = false;
      }

    }
  }

  private switch(ascendant = true) {
    const index1 = this.myNotesActived.findIndex(note => note.selected);
    const elem = this.myNotesActived[index1];
    const index2 = ascendant ? index1 -1 : index1 + 1;
    const position1 = elem?.position;
    const position2 = this.myNotesActived[index2] && this.myNotesActived[index2].position;
    if (position1 !== undefined && position2 !== undefined) {
      this.loading = true;
      this.myNotesService.switch(position1, position2)
      .then(resp => {
        if (resp) {
          const actived = this.myNotesService.getActived(this.themeSelected?.colorId);
          this.myNotesActived = actived
            .map(note => {
            const colorData = this.config.getThemeData(note?.themeId);
            return {
              ...note,
              ...colorData,
              selected: note.id === elem.id
            };
          });
          this.setFocus(elem.id);
        }
      })
      .finally(() => (this.loading = false));
    }
  }

  private editNote() {
    this.firstItemInView = this.activedSelected[0].id;
    this.router.navigate(['my-notes/edit', this.activedSelected[0].id]);
  }

  private continueArchive() {
    this.loading = true;
    this.myNotesService
      .archive(this.activedSelected)
      .then(() => this.updateData(true))
      .catch(_ => this.utilsServ.showToast('Ha ocurrido un error', true))
      .finally(() => (this.loading = false));
  }
  private continueDelete() {
    this.loading = true;
    this.myNotesService
      .delete(this.activedSelected)
      .then(() => this.updateData(true))
      .catch(_ => this.utilsServ.showToast('Ha ocurrido un error', true))
      .finally(() => (this.loading = false));
  }

  private unselectNotes() {
    this.myNotesActived.forEach(note => (note.selected = false));
  }

  private async archive() {
    this.loading = true;
    await this.utilsServ.showAlert('Las notas seleccionadas van a ser archivadas, ¿Desea continuar?').then(data => {
      if (data.role === 'cancel') {
        this.loading = false;
      } else {
        this.continueArchive();
      }
    });
  }
  private async delete() {
    this.loading = true;
    await this.utilsServ.showAlert('Las notas seleccionadas van a ser eliminadas, ¿Desea continuar?').then(data => {
      if (data.role === 'cancel') {
        this.loading = false;
      } else {
        this.continueDelete();
      }
    });
  }

  private retrieveNotesFromService() {
    const defaultThemeIdData = this.config.defaultThemeIdData;
    this.myNotesActived = this.myNotesService.getActived(this.themeSelected?.themeId).map(note => {
      const colorData = this.config.getThemeData(note?.themeId);
      return {
        ...note,
        ...colorData || defaultThemeIdData
      };
    });
    this.myNotesArchived = this.myNotesService.getArchived(this.themeSelected?.themeId).map(note => {
      const colorData = this.config.getThemeData(note?.themeId);
      return {
        ...note,
        ...colorData || defaultThemeIdData
      };
    });
  }

  private updateData(updateThemes?) {
    this.retrieveNotesFromService();
    this.getFabIconState();
    if (updateThemes) {
      this.updateThemes();
    }
  }

  private updateThemes() {
    this.themes = this.config.getThemesData().filter(theme =>
      this.myNotesService.getActived().some(note => note.themeId === theme.themeId) ||
      this.myNotesService.getArchived().some(note => note.themeId === theme.themeId)
    );
    if (this.themeSelected && !this.themes.some(th => this.themeSelected.themeId === th.themeId)) {
      this.onFilterByThemeId('');
    }
  }

  private setFocus(id) {
    setTimeout(() => {
      this.pageLoaded = false;
      const noteSelected = this.notesComp.find(
        note => note.nativeElement.classList.contains('note-'+id));
        if (noteSelected) {
          const height = noteSelected.nativeElement.offsetHeight;
          this.scrollPosition = noteSelected.nativeElement.offsetTop;
          const notePositionInitial = noteSelected.nativeElement.offsetTop;;
          const notePositionEnd = this.scrollPosition + height;
          const contentPositionInitial = this.contentElement.offsetTop;
          const contentPositionEnd = this.contentElement.offsetTop + this.contentElement.offsetHeight;
          noteSelected.nativeElement.scrollIntoView({behavior: 'smooth'});
        }
    });
  }
}
