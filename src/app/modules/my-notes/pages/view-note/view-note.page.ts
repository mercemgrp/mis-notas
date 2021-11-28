import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NoteActionButtons } from 'src/app/shared/constants/note-action-buttons';
import { NoteAction } from 'src/app/shared/constants/note-action';
import { MyNoteUi } from 'src/app/shared/models/my-note';
import { MyNotesService } from 'src/app/core/services/my-notes.service';
import { NotesStatus } from 'src/app/shared/constants/notes-status';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ThemeUi } from 'src/app/shared/models/configuration-ui';
import { NoteTypes } from 'src/app/shared/constants/note-types';
import { StaticUtilsService } from 'src/app/core/services/static-utils.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-view-note',
  templateUrl: 'view-note.page.html',
  styleUrls: ['view-note.page.scss']
})
export class ViewNotePage {
  @ViewChild('colorSelectorModalCmp') colorSelectorModalComp: ModalComponent;
  @ViewChild('calendarModalCmp') calendarModalCmp: ModalComponent;
  data: MyNoteUi;
  notifications: string[] = [];
  showThemeSelector = false;
  showCalendar = false;
  loading = false;
  imageSelected = '';
  actionButtons = NoteActionButtons;
  actions = NoteAction;
  notesStatus = NotesStatus;
  themes: ThemeUi[];
  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private service: MyNotesService,
    private router: Router,
    private utils: UtilsService,
    private config: ConfigService,
    private notificationsService: NotificationsService
    ) {
      this.notificationsService.changes$
      .pipe(tap(() => this.getNotifications()))
      .subscribe();
  }

  ionViewWillEnter() {

    this.loading = true;
    this.themes = this.config.getThemesData();
    const note = this.service.get(this.activatedRoute.snapshot.params.id);
    const colorData = this.config.getThemeData(note.themeId) || this.config.defaultThemeIdData;
    this.data = {
      ...note,
      ...colorData
    };
    this.getNotifications();

  }

  ionViewDidEnter() {
    this.loading = false;
  }

  ionViewDidLeave() {
    this.data = null;
  }

  onSelectDateTime(date: Date) {
    this.calendarModalCmp.onHide();
    this.notificationsService.schedule({
      date, noteId: this.data.id,
      title: this.data.type === NoteTypes.list ? this.data.title : undefined,
      body: this.data.type === NoteTypes.note ? this.data.content :
      this.data.listItems.reduce((result, item) => result + item + ',', '')
    });
    this.utils.showToast(`Se ha creado la notificación para el día ${StaticUtilsService.getDateStr(date)}`, false, 5000);
  }


  onBack() {
    this.loading = true;
    if (this.showThemeSelector) {
      this.switchColorPalette();
      setTimeout(() => {
        this.navCtrl.back();
      }, 250);
    } else if(this.showCalendar) {
      this.showCalendarFn();
      setTimeout(() => {
        this.navCtrl.back();
      }, 250);
    }else {
      this.navCtrl.back();
    }
  }

  onFireHeaderButtonAction(id) {
    switch(id) {
      case this.actionButtons.switchColorSelector:
        this.switchColorPalette();
      break;
      case this.actionButtons.pickImage:
      this.pickImage();
      break;
      case this.actionButtons.delete:
        this.delete();
      break;
      case this.actionButtons.closeImage:
        this.closeImage();
      break;
      case this.actionButtons.deleteImage:
        this.deleteImage();
      break;
      case this.actionButtons.archive:
        this.archive();
      break;
      case this.actionButtons.unarchive:
        this.unarchive();
      break;
      case this.actionButtons.edit:
        this.edit();
      break;
      case this.actionButtons.toggleCalendar:
        this.showCalendarFn();
      break;
      default:
      break;
    }
  }

  onEdit() {
    this.edit();
  }
  onSelectImage(image) {
    this.imageSelected = image;
  }

  onSelectTheme(themeId) {
    this.loading = true;
    this.colorSelectorModalComp.onHide();
    if (themeId) {
      this.onSaveTheme(themeId);
    }

  }

  onCancelCreateAlert() {
    this.showCalendar = false;
  }

  private onSaveTheme(themeId) {
    const editedNote = {
      ...this.data,
      themeId
    };
    this.service.save(editedNote)
    .then(() => {
      const themeData = this.config.getThemeData(themeId) || this.config.defaultThemeIdData;
      this.data = {
        ...this.data,
        ...themeData
      };
    })
    .catch(_ => this.utils.showToast('Ha ocurrido un error guardando el color', true))
    .finally(() => this.loading = false);
  }

  private getNotifications() {
    this.notifications = this.notificationsService.getScheduledNotificationsByNoteId(this.data?.id).map(data =>
      StaticUtilsService.getDateStr(data.schedule.at));
  }

  private showCalendarFn() {
    if (this.showThemeSelector) {
      return;
    }
    if (this.showCalendar) {
      this.calendarModalCmp?.onHide();
    } else {
      this.showCalendar = true;
    }
  }

  private async archive() {
    this.loading = true;
    await this.utils.showAlert('La nota va a ser archivada, ¿Desea continuar?').then(data => {
      if (data.role === 'cancel') {
        this.loading = false;
      } else {
        this.continueArchive();
      }
    });
  }

  private continueArchive() {
    this.service
    .archive(this.data)
    .then(() => {
      this.utils.showToast('La nota ha sido archivada');
      this.navCtrl.back();
    })
    .catch(_ => this.utils.showToast('Ha ocurrido un error archivando la nota', true))
    .finally(() => (this.loading = false));
  }
  private edit() {
    this.loading = true;
    this.router.navigate(['/my-notes/edit', this.data.id])
      .catch(() => this.utils.showToast('Ha ocurrido un error', true));
  }

  private async unarchive() {
    this.loading = true;
    await this.utils.showAlert('La nota va a ser recuperada, ¿Desea continuar?').then(data => {
      if (data.role === 'cancel') {
        this.loading = false;
      } else {
        this.continueUnarchive();
      }
    });
  }
  private continueUnarchive() {
    this.loading = true;
    this.service
      .unarchive(this.data)
      .then(() => {
        this.utils.showToast('La nota ha sido recuperada');
        this.navCtrl.back();
      })
      .catch(_ => this.utils.showToast('Ha ocurrido un error', true))
      .finally(() => (this.loading = false));
  }


  private closeImage() {
    this.imageSelected = '';
  }

  private deleteImage() {
    this.loading = true;
    const index = this.data.images.findIndex((img, i) => img === this.imageSelected);
    const imagesCopy = this.data.images.filter((img, i) => i !== index);
    this.imageSelected = '';
    this.service.save({
      ...this.data,
      images: imagesCopy
    })
      .then(() => {
        this.data.images = imagesCopy;
        this.utils.showToast('La imagen se ha eliminado correctamente');
      })
      .catch(_ => this.utils.showToast('Ha ocurrido un error eliminando la imagen', true))
      .finally(() => this.loading = false);
  }

  private pickImage() {
    this.data.images = this.data.images || [];
    this.utils.pickImage()
    .then(images => {
      const newImages = this.data.images.concat(...images);
      this.service.save({
        ...this.data,
        images: newImages
      })
        .then(() => this.data.images = newImages)
        .catch(_ => this.utils.showToast('Ha ocurrido un error guardando la imagen', true))
        .finally(() => this.loading = false);
    })
    .catch(() => this.utils.showToast('Ha ocurrido un error', true));
  }

  private  switchColorPalette() {
    if (this.showCalendar) {
      return;
    }
    if (this.showThemeSelector) {
      this.colorSelectorModalComp?.onHide();
    } else {
      this.calendarModalCmp?.onHide();
      this.showThemeSelector = true;
    }
  }

    private async delete() {
      this.loading = true;
      await this.utils.showAlert('La nota va a ser eliminada, ¿Desea continuar?').then(data => {
        if (data.role === 'cancel') {
          this.loading = false;
        } else {
          this.continueDelete();
        }
      });
    }
  private continueDelete() {
    this.loading = true;
    this.service.delete(this.data)
    .catch(_ => this.utils.showToast('Ha ocurrido un error eliminando la nota', true))
    .finally(() => {
      this.loading = false;
      this.utils.showToast('La nota ha sido borrada');
      this.navCtrl.back();
    });
  }

}
