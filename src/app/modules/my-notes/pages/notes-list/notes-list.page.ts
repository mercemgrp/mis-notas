import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NoteActionButtons } from 'src/app/shared/constants/note-action-buttons';
import { HEADER_HEIGHT } from 'src/app/shared/constants/header-px';
import { MyNoteUi } from 'src/app/shared/models/my-note';
import { MyNotesService } from 'src/app/core/services/my-notes.service';
import { NotesStatus } from 'src/app/shared/constants/notes-status';
import { NotesListHeaderComponent } from './notes-list-header/notes-list-header.component';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ThemeUi } from 'src/app/shared/models/configuration-ui';
import { ConfigService } from 'src/app/core/services/config.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

@Component({
  selector: 'app-notes-list',
  templateUrl: 'notes-list.page.html',
  styleUrls: ['notes-list.page.scss']
})
export class NotestListPage implements OnDestroy {
  @ViewChild(ModalComponent) optionsSelectorModalCmp: ModalComponent;
  @ViewChild(NotesListHeaderComponent) headerComp: NotesListHeaderComponent;
  get showedFilterToolbar() {
    return this.headerComp.showFilterToolbar;
  }
  get oneSelected() {
    return this.activedSelected.length === 1;
  }
  get activedSelected() {
    return this.myNotesActived.filter(note => note.selected);
  }
  notesStatus: NotesStatus = NotesStatus.active;
  scrollPosition = 0;
  scrollingDown = false;
  showFabIcon = false;
  myNotesArchived: MyNoteUi[] = [];
  myNotesActived: MyNoteUi[] = [];
  width = 100;
  loading = false;
  showColorSelector = false;
  selectedColor: ThemeUi;
  numberOfNotesSelected = 0;
  actionButtons = NoteActionButtons;
  themes: ThemeUi[]= [];
  pageLoaded = false;
  private ngUnsubscribe = new Subject<void>();
  constructor(
    private router: Router,
    private myNotesService: MyNotesService,
    private utilsServ: UtilsService,
    private config: ConfigService) {}

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ionViewWillEnter() {
    this.pageLoaded = false;
    this.updateNotes();
    this.unselectNotes();
    this.themes = this.config.getThemesData();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.pageLoaded = true;
      this.getFabIconState();
    }, 1000);
  }

  ionViewWillLeave() {
    this.showFabIcon = false;
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

  onFilter(colorSelected: ThemeUi) {
    if (colorSelected) {
      this.selectedColor = {
        ...this.themes.find(c => c.colorId === colorSelected.colorId),
        ...colorSelected
      };
    } else {
      this.selectedColor = null;
    }
   this.updateNotes();
    this.unselectNotes();
  }

  unselectTheme() {
    this.selectedColor = null;
    this.updateNotes();
    this.unselectNotes();
    this.headerComp.clearTheme();
  }

  onSwitchColorSelector() {
    if (!this.showColorSelector) {
      this.showColorSelector = true;
    } else {
      this.optionsSelectorModalCmp.onHide();
    }
  }

  onCloseColorSelector() {
    this.showColorSelector = false;
  }
  onViewNote(id) {
    if (!this.activedSelected.length) {
      this.router.navigate(['my-notes/view', id]);
    }
  }

  onAddNote() {
    this.router.navigate(['my-notes/create', { color: this.selectedColor?.colorId || ''}]);
  }
  onScroll(e): void {
    if (e.detail.scrollTop === 0) {
      this.scrollingDown = false;
      this.scrollPosition = e.detail.scrollTop;
      this.showFabIcon = true;
    } else if (
      this.scrollPosition < e.detail.scrollTop - HEADER_HEIGHT ||
      this.scrollPosition > e.detail.scrollTop + HEADER_HEIGHT
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
      .then(() => this.updateNotes())
      .finally(() => {
        this.unselectNotes();
        this.optionsSelectorModalCmp.onHide();
        this.loading = false;
      });
  }

  onSelectNote(e: Event, data: MyNoteUi, index) {
    data.selected = !data.selected;
  }
  private closeToolbar() {
    if (this.showColorSelector) {
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
    const index2 = ascendant ? index1 + -1 : index1 + 1;
    const data1 = {...this.myNotesActived[index1]};
    const data2 = {...this.myNotesActived[index2]};
    if (index1 > -1 && index2 > -1 && index2 < this.myNotesActived.length && data1 && data2) {
      this.loading = true;
      this.myNotesService.switch(data1, data2)
      .then(resp => {
        if (resp) {
          const colorData = this.config.getThemeData(this.selectedColor?.colorId) || this.config.defaultThemeIdData;
          const actived = this.myNotesService.getActived(this.selectedColor?.colorId);
          this.myNotesActived = actived
            .map(n => ({
              ...n,
              selected: n.id === data1.id,
              ...colorData
            }));
        }
      })
      .finally(() => (this.loading = false));
    }
  }

  private editNote() {
    this.router.navigate(['my-notes/edit', this.activedSelected[0].id]);
  }

  private continueArchive() {
    this.loading = true;
    this.myNotesService
      .archive(this.activedSelected)
      .then(() => this.updateNotes())
      .catch(_ => this.utilsServ.showToast('Ha ocurrido un error', true))
      .finally(() => (this.loading = false));
  }
  private continueDelete() {
    this.loading = true;
    this.myNotesService
      .delete(this.activedSelected)
      .then(() => this.updateNotes())
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
    this.myNotesActived = this.myNotesService.getActived(this.selectedColor?.colorId).map(note => {
      const colorData = this.config.getThemeData(note?.themeId);
      return {
        ...note,
        ...colorData || defaultThemeIdData
      };
    });
    this.myNotesArchived = this.myNotesService.getArchived(this.selectedColor?.colorId).map(note => {
      const colorData = this.config.getThemeData(note?.themeId);
      return {
        ...note,
        ...colorData || defaultThemeIdData
      };
    });
  }

  private updateNotes() {
    this.retrieveNotesFromService();
    this.getFabIconState();
  }

}
