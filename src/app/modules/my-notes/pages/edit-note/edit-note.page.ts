import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MyNoteUi } from 'src/app/shared/models/my-note';
import { MyNotesService } from 'src/app/core/services/my-notes.service';
import { NoteActionButtons } from 'src/app/shared/constants/note-action-buttons';
import { NoteAction } from 'src/app/shared/constants/note-action';
import { NotesStatus } from 'src/app/shared/constants/notes-status';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ThemeUi } from 'src/app/shared/models/configuration-ui';
import { EditTextAreaComponent } from './edit-text-area/edit-text-area.component';
import { EditListComponent } from './edit-list/edit-list.component';
import { NoteTypes } from 'src/app/shared/constants/note-types';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { StaticUtilsService } from 'src/app/core/services/static-utils.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-note',
  templateUrl: 'edit-note.page.html',
  styleUrls: ['edit-note.page.scss']
})
export class EditNotePage {
  @ViewChild('myNoteEdit') myNoteEdit: EditTextAreaComponent | EditListComponent;
  @ViewChild('colorSelectorModalCmp') colorSelectorModalComp: ModalComponent;
  @ViewChild('calendarModalCmp') calendarModalCmp: ModalComponent;
  data: MyNoteUi;
  isNote;
  showThemeSelector = false;
  showCalendar = false;
  loading = false;
  imageSelected = '';
  actionButtons = NoteActionButtons;
  actions = NoteAction;
  notesStatus = NotesStatus;
  themes: ThemeUi[];
  notifications: {id: number; date: string}[] = [];
  newNotificationsDates: Date[] = [];
  get enableImagePicker() {
    return !this.data?.images || this.data.images?.length < 3;
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private service: MyNotesService,
    private utilsServ: UtilsService,
    private navCtrl: NavController,
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
    if (this.activatedRoute.snapshot.params?.id) {
      const note = this.service.get(this.activatedRoute.snapshot.params.id);
      const colorData = this.config.getThemeData(note.themeId) || this.config.defaultThemeIdData;
      this.data = {
        ...note,
        ...colorData,
        type: note.type || 1
      };
      if (!this.data) {
        this.navCtrl.back();
      }
    } else {
      const themeId = this.activatedRoute.snapshot.params?.themeId;
      const colorData = this.config.getThemeData(themeId) || this.config.defaultThemeIdData;
      this.data = {
        id: null,
        type: 1,
        content: '',
        ...colorData,
        position: null
      };
    }
    this.isNote = this.data.type === NoteTypes.note;
    this.getNotifications();

  }

  ionViewDidEnter() {
    this.loading = false;
  }

  ionViewDidLeave() {
    this.data = null;
  }

  onToggleNoteType(value) {
    if (value.detail) {
      this.isNote = value.detail.checked;
    }
  }
  onFireHeaderButtonAction(id) {
    switch(id) {
      case this.actionButtons.save:
        this.onSave();
      break;
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
      case this.actionButtons.toggleCalendar:
        this.showCalendarFn();
      break;
      default:
      break;
    }
  }

  onSelectDateTime(date: Date) {
    this.calendarModalCmp.onHide();
    this.newNotificationsDates.push(date);
    this.utilsServ.showToast(`Se creará la nota cuando termines la edición`, false, 5000);
  }

  onCancelCreateAlert() {
    this.calendarModalCmp.onHide();
  }

  onCreateNotifications() {
    if (this.newNotificationsDates.length) {
      this.newNotificationsDates.forEach(date => {
        const listItemsStr = this.data.listItems?.filter(item => !item.checked)
        .reduce((result, item) => result + item.item + '\n', '');
        this.notificationsService.schedule({
        date, noteId: this.data.id,
        title: this.data.type === NoteTypes.list ? this.data.title : undefined,
        body: this.data.type === NoteTypes.note ? this.data.content : listItemsStr
      });
      this.utilsServ.showToast(`Se ha creado la notificación para el día ${StaticUtilsService.getDateStr(date)}`, false, 5000);
      });
    }
  }



  onSelectTheme(themeId) {
    this.colorSelectorModalComp.onHide();
    if (themeId) {
      const themeData = this.config.getThemeData(themeId) || this.config.defaultThemeIdData;
      this.data = {
        ...this.data,
        ...themeData
      };
    }

  }

  onCloseThemeSelector() {
    this.showThemeSelector = false;
  }

  onSelectImage(image) {
    this.imageSelected = image;
  }

  async onDeleteNotification(id) {
    this.loading = true;
    await this.utilsServ.showAlert('La notificación va a ser eliminada ¿Desea continuar?').then(data => {
      if (data.role === 'ok') {
        this.continueDeleteNotification(id);
      } else {
        this.loading = false;
      }
    });
}

continueDeleteNotification(id) {
  this.notificationsService.deleteNotification(id).then(() => {
    this.utilsServ.showToast('Se ha eliminado la notificación');
    this.getNotifications();
  })
  .finally(() => this.loading = false);
}

  onBack() {
    this.loading = true;
    if (this.showThemeSelector) {
      this.switchColorPalette();
      setTimeout(() => {
        this.save(true).then(() => this.navCtrl.back());
      }, 250);
    } else if(this.showCalendar) {
      this.showCalendarFn();
      setTimeout(() => {
        this.save(true).then(() => this.navCtrl.back());
      }, 250);
    }else {
      this.save(true).then(() => this.navCtrl.back());
    }
  }

  onSave() {
    if (!this.loading) {
      this.save()
        .then(() => this.navCtrl.back())
        .catch(() => this.utilsServ.showToast('Rellene los datos correctamente', true));
    }
  }


  private getNotifications() {
    this.notifications = this.notificationsService.getScheduledNotificationsByNoteId(this.data?.id).map(data => ({
      id: data.id,
      date: StaticUtilsService.getDateStr(new Date(data.schedule.at))
    }));
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

  private async archive() {
    this.loading = true;
    await this.utilsServ.showAlert('La nota va a ser archivada, ¿Desea continuar?').then(data => {
      if (data.role === 'ok') {
        this.continueArchive();
      } else {
        this.loading = false;
      }
    });
  }

  private continueArchive() {
    this.service
    .archive(this.data)
    .then(() => {
      this.utilsServ.showToast('La nota ha sido archivada');
      this.navCtrl.back();
    })
    .catch(_ => this.utilsServ.showToast('Ha ocurrido un error archivando la nota', true))
    .finally(() => (this.loading = false));
  }

  private async unarchive() {
    this.loading = true;
    await this.utilsServ.showAlert('La nota va a ser recuperada, ¿Desea continuar?').then(data => {
      if (data.role === 'ok') {
        this.continueUnarchive();
      } else {
        this.loading = false;
      }
    });
  }
  private continueUnarchive() {
    this.loading = true;
    this.service
      .unarchive(this.data)
      .then(() => {
        this.utilsServ.showToast('La nota ha sido recuperada');
        this.navCtrl.back();
      })
      .catch(_ => this.utilsServ.showToast('Ha ocurrido un error', true))
      .finally(() => (this.loading = false));
  }

  private showCalendarFn() {
    if (this.showThemeSelector) {
      return;
    }
    if (this.showCalendar) {
      this.calendarModalCmp.onHide();
    } else {
      this.showCalendar = true;
    }
  }

  private deleteImage() {
    this.loading = true;
    const index = this.data.images.findIndex((img, i) => img === this.imageSelected);
    this.data.images = this.data.images.filter((img, i) => i !== index);
    this.imageSelected = '';
  }

  private closeImage() {
    this.imageSelected = '';
  }
  private pickImage() {
    this.data.images = this.data.images || [];
    this.utilsServ.pickImage()
    .then(images => this.data.images.push(...images))
    .catch(() => this.utilsServ.showToast('Ha ocurrido un error', true));
  }

    private async delete() {
      this.loading = true;
      await this.utilsServ.showAlert('La nota va a ser eliminada, ¿Desea continuar?').then(data => {
        if (data.role === 'ok') {
          this.continueDelete();
        } else {
          this.loading = false;
        }
      });
    }
  private continueDelete() {
    this.loading = true;
    this.service.delete(this.data)
    .then(() => {
      this.notificationsService.deleteNotificationsFromNoteId(this.data.id).finally(() => {
        this.utilsServ.showToast('La nota se ha eliminado');
      });
      })
    .catch(_ => this.utilsServ.showToast('Ha ocurrido un error eliminando la nota', true))
    .finally(() => {
      this.loading = false;
      this.navCtrl.back();
    });
  }
  private save(isBack?) {
    return this.myNoteEdit?.onSubmit()
      .then(data => {
        if (this.data.id) {
          return this.modify(data);
        } else {
          return this.create(data);
        }
      }).catch(err => {
        if (!isBack) {
          this.utilsServ.showToast(err);
          throw new Error('');
        } else {
          return true;
        }

      }
      );
  }

  private create(data) {
    this.loading = true;
        this.data.type = this.isNote ? NoteTypes.note : NoteTypes.list;
        return this.service.create({
          ...this.data,
          ...data
        })
        .then(id => {
          this.data.id = id;
          this.utilsServ.showToast('La nota se ha creado');
          this.onCreateNotifications();
        })
        .catch(_ => {
          this.utilsServ.showToast('Ha ocurrido un error guardando la nota', true);
        });

  }

  private modify(data) {
    this.loading = true;
        return this.service.save({
          ...this.data,
          ...data
        })
        .then(() => this.onCreateNotifications())
        .catch(_ => {
          this.utilsServ.showToast('Ha ocurrido un error guardando la nota', true);
        });
  }

}
