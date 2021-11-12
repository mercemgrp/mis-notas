import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { OptionsSelectorComponent } from 'src/app/shared/components/options-selector/options-selector.component';
import { NoteActionButtons } from 'src/app/shared/constants/note-action-buttons';
import { HEADER_HEIGHT } from 'src/app/shared/constants/header-px';
import { MyNote, MyNoteUi } from 'src/app/shared/models/my-note';
import { MyNotesService } from 'src/app/shared/services/my-notes.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: 'notes-list.page.html',
  styleUrls: ['notes-list.page.scss']
})
export class NotestListPage implements OnDestroy {
  @ViewChild(OptionsSelectorComponent) optionsSelectorComp: OptionsSelectorComponent;
  get selected() {
    return this.myNotes.filter(note => note.selected);
  }
  get elemsSelected() {
    return this.selected.length > 0;
  }
  get oneSelected() {
    return this.selected.length === 1;
  }
  get typeNotesSelected() {
    if (this.selected.some(elem => elem.archived) && this.selected.some(elem => !elem.archived)) {
      return 2;
    } else if (this.selected.some(elem => elem.archived)) {
      return 3;
    } else {
      return 1;
    }
  }
  scrollPosition = 0;
  scrollingDown = false;
  showFabIcon = false;
  myNotes: MyNoteUi[] = [];
  myNotesArchived: MyNoteUi[] = [];
  myNotesActived: MyNoteUi[] = [];
  width = 100;
  loading = false;
  showColorSelector = false;
  colorFiltered = '';
  actionButtons = NoteActionButtons;
  private ngUnsubscribe = new Subject<void>();
  constructor(private router: Router, private myNotesService: MyNotesService, private toastController: ToastController) {}

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ionViewWillEnter() {
    this.retrieveNotesFromService();
    this.unselectNotes();
  }

  ionViewWillLeave() {
    this.showFabIcon = false;
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.showFabIcon = true;
    });
  }

  onFireHeaderButtonAction(id) {
    switch (id) {
      case this.actionButtons.closeToolbar:
        this.closeToolbar();
        break;
      case this.actionButtons.switchAscendent:
        this.switch(this.selected[0], true);
        break;
      case this.actionButtons.switchDescendent:
        this.switch(this.selected[0], false);
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
      case this.actionButtons.unarchive:
        this.unarchive();
        break;
      default:
        break;
    }
  }

  onFilter(color) {
    this.colorFiltered = color;
   this.retrieveNotesFromService();
    this.unselectNotes();
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
    this.router.navigate(['my-notes/view', id]);
  }

  onAddNote() {
    this.router.navigate(['my-notes/create', { color: this.colorFiltered }]);
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
    const myNotes = this.selected.map(elem => ({
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
      .switch(data, ascendant, this.colorFiltered)
      .then(() => this.retrieveNotesFromService())
      .finally(() => (this.loading = false));
  }

  private editNote() {
    this.router.navigate(['my-notes/edit', this.selected[0].id]);
  }

  private archive() {
    this.loading = true;
    this.myNotesService
      .archive(this.selected)
      .then(() => this.retrieveNotesFromService())
      .catch(_ => this.presentToast('Ha ocurrido un error eliminando'))
      .finally(() => (this.loading = false));
  }
  private unarchive() {
    this.loading = true;
    this.myNotesService
      .unarchive(this.selected)
      .then(() => this.retrieveNotesFromService())
      .catch(_ => this.presentToast('Ha ocurrido un error eliminando'))
      .finally(() => (this.loading = false));
  }
  private delete() {
    this.loading = true;
    this.myNotesService
      .delete(this.selected)
      .then(() => this.retrieveNotesFromService())
      .catch(_ => this.presentToast('Ha ocurrido un error eliminando'))
      .finally(() => (this.loading = false));
  }

  private unselectNotes() {
    this.myNotes.forEach(note => (note.selected = false));
  }

  private async presentToast(message) {
    const toast = await this.toastController.create({
      color: 'secondary',
      animated: true,
      cssClass: 'my-toast',
      message,
      duration: 2000
    });
    toast.present();
  }

  private retrieveNotesFromService() {
    this.myNotesActived = this.myNotesService.getActived(this.colorFiltered);
    this.myNotesArchived = this.myNotesService.getArchived(this.colorFiltered);
    this.myNotes = this.myNotesActived.concat(this.myNotesArchived);
  }
}
