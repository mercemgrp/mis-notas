import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { MyNoteEditComponent } from 'src/app/shared/components/my-note-edit/my-note-edit.component';
import { COLORS } from 'src/app/shared/constants/colors';
import { MyNote } from 'src/app/shared/models/my-note';
import { MyNotesService } from 'src/app/shared/services/my-notes.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { OptionsSelectorComponent } from 'src/app/shared/components/options-selector/options-selector.component';
import { NoteActionButtons } from 'src/app/shared/constants/note-action-buttons';
import { NoteAction } from 'src/app/shared/constants/note-action';
import { NotesStatus } from 'src/app/shared/constants/notes-status';
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
    private toastController: ToastController,
    private navCtrl: NavController,
    private nativeKeyboard: Keyboard,
    private imagePicker: ImagePicker

  ) {

  }

  ionViewWillEnter() {
    if (this.activatedRoute.snapshot.params?.id) {
      this.data = this.service.get(this.activatedRoute.snapshot.params.id);
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
    this.nativeKeyboard.show();
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
      this.save().then(() => this.navCtrl.back());
    }
  }


  private deleteImage() {
    this.service.deleteImage(this.data.id, this.imageSelected)
      .catch(_ => this.presentToast('Ha ocurrido un error eliminando la imagen'))
      .finally(() => this.closeImage());
  }

  private closeImage() {
    this.imageSelected = '';
  }
  private pickImage() {
    const currentImgLength = this.data.images?.length || 0;
    if (currentImgLength === 3) {
      alert('No puedes subir más de tres imágenes');
      return;
    }
    const options: ImagePickerOptions = {
    quality: 100,
    outputType: 1,
    maximumImagesCount: 3 - currentImgLength
    };
    if (!this.data.images) {
      this.data.images = [];
    }
     this.imagePicker.getPictures(options).then((imageData) => {
       const imagesSelected = imageData && !Array.isArray(imageData) ? [imageData] : (imageData || []);
       imagesSelected.forEach(image => {
        const base64Image = 'data:image/jpeg;base64,' + image;
        this.data.images.push(base64Image);
      });

    }, (err) => {
    // Handle error
    });
    }

  private delete() {
      this.service.delete(this.data)
      .catch(_ => this.presentToast('Ha ocurrido un error eliminando'))
      .finally(() => this.navCtrl.navigateRoot(''));
    }
  private save(isBack?) {
    return this.myNoteEdit?.onSubmit()
      .then(data => {
        this.loading = true;
        return this.service.save({
          ...this.data,
          ...data
        }).catch(_ => {
          this.presentToast('Ha ocurrido un error guardando la nota');
        });
      }).catch(err => {
        if (!isBack) {
          this.presentToast(err);
        }});
    }


  private async presentToast(message?) {
    const toast = await this.toastController.create({
      color: 'secondary',
      animated: true,
      cssClass: 'my-toast',
      message: message || 'Ha ocurrido un error',
      duration: 2000
    });
    toast.present();
  }

}
