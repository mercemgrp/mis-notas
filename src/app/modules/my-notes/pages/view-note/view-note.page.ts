import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NoteActionButtons } from 'src/app/shared/constants/note-action-buttons';
import { NoteAction } from 'src/app/shared/constants/note-action';
import { MyNote, MyNoteUi } from 'src/app/shared/models/my-note';
import { MyNotesService } from 'src/app/core/services/my-notes.service';
import { NotesStatus } from 'src/app/shared/constants/notes-status';
import { UtilsService } from 'src/app/core/services/utils.service';
import { COLORS } from 'src/app/shared/constants/colors';
import { ConfigService } from 'src/app/core/services/config.service';
@Component({
  selector: 'app-view-note',
  templateUrl: 'view-note.page.html',
  styleUrls: ['view-note.page.scss']
})
export class ViewNotePage {
  data: MyNoteUi;
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
    private utils: UtilsService,
    private config: ConfigService
    ) {
  }

  ionViewWillEnter() {
    this.loading = true;
    const note = this.service.get(this.activatedRoute.snapshot.params.id);
    const colorData = this.config.getColorData(note.color);
    this.data = {
      ...note,
      c1: colorData?.c1 || COLORS.yellow.c1,
      c2: colorData?.c2 || COLORS.yellow.c2
    };

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

  onSelectColor(colorId) {
    this.loading = true;
    const editedNote = {
      ...this.data,
      color: colorId
    };
    this.service.save(editedNote)
      .then(() => {
        const colorData = this.config.getColorData(colorId);
        this.data = {
          ...this.data,
          c1: colorData?.c1 || COLORS.yellow.c1,
          c2: colorData?.c2 || COLORS.yellow.c2
        };
      })
      .catch(_ => this.utils.showToast('Ha ocurrido un error guardando el color', true))
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
    .catch(_ => this.utils.showToast('Ha ocurrido un error eliminando la nota', true))
    .finally(() => {
      this.loading = false;
      this.utils.showToast('La nota ha sido borrada');
      this.navCtrl.back();
    });
  }

}
