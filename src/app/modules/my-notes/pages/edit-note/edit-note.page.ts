import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { COLORS } from 'src/app/shared/constants/colors';
import { MyNote } from 'src/app/shared/models/my-note';
import { MyNotesService } from 'src/app/core/services/my-notes.service';
import { OptionsSelectorComponent } from 'src/app/modules/my-notes/shared/components/options-selector/options-selector.component';
import { NoteActionButtons } from 'src/app/shared/constants/note-action-buttons';
import { NoteAction } from 'src/app/shared/constants/note-action';
import { NotesStatus } from 'src/app/shared/constants/notes-status';
import { MyNoteEditComponent } from '../../shared/components/my-note-edit/my-note-edit.component';
import { UtilsService } from 'src/app/core/services/shell.service';

@Component({
  selector: 'app-edit-note',
  templateUrl: 'edit-note.page.html',
  styleUrls: ['edit-note.page.scss']
})
export class EditNotePage {
  @ViewChild(MyNoteEditComponent) myNoteEdit: MyNoteEditComponent;
  @ViewChild(OptionsSelectorComponent) optionsSelectorComp: OptionsSelectorComponent;
  data: MyNote;
  showColorSelector = false;
  loading = false;
  imageSelected = '';
  actionButtons = NoteActionButtons;
  actions = NoteAction;
  notesStatus = NotesStatus;
  get enableImagePicker() {
    return !this.data?.images || this.data.images?.length < 3;
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private service: MyNotesService,
    private utilsServ: UtilsService,
    private navCtrl: NavController,
    private router: Router

  ) {

  }

  ionViewWillEnter() {
    this.loading = true;
    if (this.activatedRoute.snapshot.params?.id) {
      this.data = this.service.get(this.activatedRoute.snapshot.params.id);
      if (!this.data) {
        this.navCtrl.back();
      }
    } else {
      this.data = {
        id: null,
        title: '',
        content: '',
        color:  this.activatedRoute.snapshot.params?.color || COLORS.yellow
      };
    }

  }

  ionViewDidEnter() {
    this.loading = false;
  }

  ionViewDidLeave() {
    this.data = null;
  }


  onFireHeaderButtonAction(id) {
    switch(id) {
      case this.actionButtons.save:
        this.onSave();
      break;
      case this.actionButtons.switchColorSelector:
        this.onSwitchColorPalette();
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
      default:
      break;
    }
  }

  onSelectColor(color) {
    this.data.color = color;
  }

  onSelectImage(image) {
    this.imageSelected = image;
  }


  onSwitchColorPalette() {
    if (!this.showColorSelector) {
      this.showColorSelector = true;
    } else {
      this.optionsSelectorComp.onHide();
    }
  }

  onBack() {
    this.loading = true;
    if (this.showColorSelector) {
      this.onSwitchColorPalette();
      setTimeout(() => {
        this.save(true).then(() => this.navCtrl.back());
      }, 250);
    } else {
      this.save(true).then(() => this.navCtrl.back());
    }
  }

  onSave() {
    if (!this.loading) {
      this.save()
        .then(() => this.navCtrl.back());
    }
  }

  private async archive() {
    this.loading = true;
    await this.utilsServ.showAlert('La nota va a ser archivada, ¿Desea continuar?').then(data => {
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
      this.utilsServ.showToast('La nota ha sido archivada');
      this.navCtrl.back();
    })
    .catch(_ => this.utilsServ.showToast('Ha ocurrido un error archivando la ntoa'))
    .finally(() => (this.loading = false));
  }
  private edit() {
    this.loading = true;
    this.router.navigate(['/my-notes/edit', this.data.id])
      .catch(() => this.utilsServ.showToast('Ha ocurrido un error'));
  }

  private async unarchive() {
    this.loading = true;
    await this.utilsServ.showAlert('La nota va a ser recuperada, ¿Desea continuar?').then(data => {
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
        this.utilsServ.showToast('La nota ha sido recuperada');
        this.navCtrl.back();
      })
      .catch(_ => this.utilsServ.showToast('Ha ocurrido un error'))
      .finally(() => (this.loading = false));
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
    .catch(() => this.utilsServ.showToast('Ha ocurrido un error'));
  }

    private async delete() {
      this.loading = true;
      await this.utilsServ.showAlert('La nota va a ser eliminada, ¿Desea continuar?').then(data => {
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
    .catch(_ => this.utilsServ.showToast('Ha ocurrido un error eliminando la nota'))
    .finally(() => {
      this.loading = false;
      this.utilsServ.showToast('La nota ha sido borrada');
      this.navCtrl.back();
    });
  }
  private save(isBack?) {
    return this.myNoteEdit?.onSubmit()
      .then(data => {
        this.loading = true;
        return this.service.save({
          ...this.data,
          ...data
        }).catch(_ => {
          this.utilsServ.showToast('Ha ocurrido un error guardando la nota');
        });
      }).catch(err => {
        if (!isBack) {
          this.utilsServ.showToast(err);
          throw new Error('');
        }});
    }

}
