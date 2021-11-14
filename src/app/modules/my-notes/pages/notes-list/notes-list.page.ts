import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { OptionsSelectorComponent } from 'src/app/modules/my-notes/shared/components/options-selector/options-selector.component';
import { NoteActionButtons } from 'src/app/shared/constants/note-action-buttons';
import { HEADER_HEIGHT } from 'src/app/shared/constants/header-px';
import { MyNote, MyNoteUi } from 'src/app/shared/models/my-note';
import { MyNotesService } from 'src/app/core/services/my-notes.service';
import { NotesStatus } from 'src/app/shared/constants/notes-status';
import { ConfigService } from 'src/app/core/services/config.service';
import { NotesListHeaderComponent } from './notes-list-header/notes-list-header.component';
import { UtilsService } from 'src/app/core/services/shell.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: 'notes-list.page.html',
  styleUrls: ['notes-list.page.scss']
})
export class NotestListPage implements OnDestroy {
  @ViewChild(OptionsSelectorComponent) optionsSelectorComp: OptionsSelectorComponent;
  @ViewChild(NotesListHeaderComponent) headerComp: NotesListHeaderComponent;
  get elemsSelected() {
    return this.activedSelected.length > 0;
  }
  get showedFilterToolbar() {
    return this.headerComp.showFilterToolbar;
  }
  get oneSelected() {
    return this.activedSelected.length === 1;
  }
  private get activedSelected() {
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
  selectedColor;
  numberOfNotesSelected = 0;
  actionButtons = NoteActionButtons;
  colors = [];
  pageLoaded = false;
  private ngUnsubscribe = new Subject<void>();
  constructor(
    private router: Router,
    private myNotesService: MyNotesService,
    private config: ConfigService,
    private utilsServ: UtilsService) {}

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ionViewWillEnter() {
    this.retrieveNotesFromService();
    this.unselectNotes();
    this.colors = this.config.getColorsData();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.showFabIcon = true;
      this.pageLoaded = true;
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
        this.switch(this.activedSelected[0], true);
        break;
      case this.actionButtons.switchDescendent:
        this.switch(this.activedSelected[0], false);
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

  onFilter(color) {
    this.selectedColor = (color && this.colors.find(c => c.id === color.id)) || '';
   this.retrieveNotesFromService();
    this.unselectNotes();
  }

  unselectColor() {
    this.selectedColor = '';
    this.retrieveNotesFromService();
    this.unselectNotes();
    this.headerComp.selectColor('');
  }

  onSwitchColorSelector() {
    if (!this.showColorSelector) {
      this.showColorSelector = true;
    } else {
      this.optionsSelectorComp.onHide();
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
    this.router.navigate(['my-notes/create', { color: this.selectedColor?.id || ''}]);
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

  onSelectColor(color) {
    this.loading = true;
    const myNotes = this.activedSelected.map(elem => ({
      ...elem,
      color
    }));
    this.myNotesService
      .save(myNotes)
      .then(() => this.retrieveNotesFromService())
      .finally(() => {
        this.unselectNotes();
        this.loading = false;
      });
  }

  onSelectNote(e: Event, data: MyNoteUi) {
    data.selected = !data.selected;
    this.calculateLenght();
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

  private switch(data: MyNote, ascendant = true) {
    this.loading = true;
    this.myNotesService
      .switch(data, ascendant, this.selectedColor?.id)
      .then(resp => {
        if (resp) {
          const actived = this.myNotesService.getActived(this.selectedColor?.id);
          this.myNotesActived = actived
            .map(n => ({
              ...n,
              selected: n.id === data.id
            }));
        }
      })
      .finally(() => (this.loading = false));
  }

  private editNote() {
    this.router.navigate(['my-notes/edit', this.activedSelected[0].id]);
  }

  private continueArchive() {
    this.loading = true;
    this.myNotesService
      .archive(this.activedSelected)
      .then(() => this.retrieveNotesFromService())
      .catch(_ => this.utilsServ.showToast('Ha ocurrido un error'))
      .finally(() => (this.loading = false));
  }
  private continueDelete() {
    this.loading = true;
    this.myNotesService
      .delete(this.activedSelected)
      .then(() => this.retrieveNotesFromService())
      .catch(_ => this.utilsServ.showToast('Ha ocurrido un error'))
      .finally(() => (this.loading = false));
  }

  private unselectNotes() {
    this.myNotesActived.forEach(note => (note.selected = false));
    this.myNotesArchived.forEach(note => (note.selected = false));
    this.calculateLenght();
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
    this.myNotesActived = this.myNotesService.getActived(this.selectedColor?.id);
    this.myNotesArchived = this.myNotesService.getArchived(this.selectedColor?.id);
    this.calculateLenght();
  }

  private calculateLenght() {
    this.numberOfNotesSelected = this.activedSelected.length;
  }
}
