import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { NoteActionButtons } from 'src/app/shared/constants/note-action-buttons';
import { NoteAction } from 'src/app/shared/constants/note-action';
import { MyNote } from 'src/app/shared/models/my-note';
import { MyNotesService } from 'src/app/shared/services/my-notes.service';
import { NotesStatus } from 'src/app/shared/constants/notes-status';

@Component({
  selector: 'app-view-note',
  templateUrl: 'view-note.page.html',
  styleUrls: ['view-note.page.scss']
})
export class ViewNotePage {
  data: MyNote;
  showColorSelector = false;
  loaded = false;
  imageSelected = '';
  actionButtons = NoteActionButtons;
  actions = NoteAction;
  notesStatus = NotesStatus;
  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private service: MyNotesService,
    private toastController: ToastController,
    private router: Router,
    private imagePicker: ImagePicker
    ) {
  }

  ionViewWillEnter() {
    this.loaded = false;
    this.data = this.service.get(this.activatedRoute.snapshot.params.id);
  }

  ionViewDidEnter() {
    this.loaded = true;
  }

  onBack() {
    this.navCtrl.navigateRoot('');
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
      default:
      break;
    }
  }

  onEdit() {
    this.router.navigate(['/my-notes/edit', this.data.id]);
  }


  onSelectImage(image) {
    this.imageSelected = image;
  }

  onSelectColor(color) {
    const editedNote = {
      ...this.data,
      color
    };
    this.service.save(editedNote)
      .then(() => this.data.color = color)
      .catch(_ => this.presentToast('Ha ocurrido un error guardando el color'));
  }


  private closeImage() {
    this.imageSelected = '';
  }

  private deleteImage() {
    this.service.deleteImage(this.data.id, this.imageSelected)
    .catch(_ => this.presentToast('Ha ocurrido un error eliminando la imagen'))
    .finally(() => this.closeImage());
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

  private  switchColorPalette() {
      this.showColorSelector = true;
    }

  private delete() {
    this.service.delete(this.data)
    .catch(_ => this.presentToast('Ha ocurrido un error eliminando'))
    .finally(() => this.navCtrl.navigateRoot(''));
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

}
