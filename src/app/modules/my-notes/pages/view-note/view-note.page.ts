import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NoteActionButtons } from 'src/app/shared/constants/note-action-buttons';
import { NoteAction } from 'src/app/shared/constants/note-action';
import { MyNote } from 'src/app/shared/models/my-note';
import { MyNotesService } from 'src/app/core/services/my-notes.service';
import { NotesStatus } from 'src/app/shared/constants/notes-status';
import { UtilsService } from 'src/app/core/services/shell.service';
@Component({
  selector: 'app-view-note',
  templateUrl: 'view-note.page.html',
  styleUrls: ['view-note.page.scss']
})
export class ViewNotePage {
  data: MyNote;
  showColorSelector = false;
  loading = false;
  imageSelected = '';
  actionButtons = NoteActionButtons;
  actions = NoteAction;
  notesStatus = NotesStatus;
  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private service: MyNotesService,
    private router: Router,
    private utils: UtilsService
    ) {
  }

  ionViewWillEnter() {
    this.loading = true;
    this.data = this.service.get(this.activatedRoute.snapshot.params.id);
  }

  ionViewDidEnter() {
    this.loading = false;
  }

  ionViewDidLeave() {
    this.data = null;
  }

  onBack() {
    this.loading = true;
    this.navCtrl.back();
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
      default:
      break;
    }
  }

  onSelectImage(image) {
    this.imageSelected = image;
  }

  onSelectColor(color) {
    this.loading = true;
    const editedNote = {
      ...this.data,
      color
    };
    this.service.save(editedNote)
      .then(() => this.data.color = color)
      .catch(_ => this.utils.showToast('Ha ocurrido un error guardando el color'))
      .finally(() => this.loading = false);
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
    .catch(_ => this.utils.showToast('Ha ocurrido un error archivando la ntoa'))
    .finally(() => (this.loading = false));
  }
  private edit() {
    this.loading = true;
    this.router.navigate(['/my-notes/edit', this.data.id])
      .catch(() => this.utils.showToast('Ha ocurrido un error'));
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
      .catch(_ => this.utils.showToast('Ha ocurrido un error'))
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
      .catch(_ => this.utils.showToast('Ha ocurrido un error eliminando la imagen'))
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
        .catch(_ => this.utils.showToast('Ha ocurrido un error guardando la imagen'))
        .finally(() => this.loading = false);
    })
    .catch(() => this.utils.showToast('Ha ocurrido un error'));
  }

  private  switchColorPalette() {
      this.showColorSelector = true;
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
    .catch(_ => this.utils.showToast('Ha ocurrido un error eliminando la nota'))
    .finally(() => {
      this.loading = false;
      this.utils.showToast('La nota ha sido borrada');
      this.navCtrl.back();
    });
  }

}
