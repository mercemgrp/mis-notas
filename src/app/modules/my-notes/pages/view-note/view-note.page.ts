import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { AlertController, NavController, ToastController } from '@ionic/angular';
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
  loading = false;
  imageSelected = '';
  actionButtons = NoteActionButtons;
  actions = NoteAction;
  notesStatus = NotesStatus;
  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private service: MyNotesService,
    private toastController: ToastController,
    private alertCtrl: AlertController,
    private router: Router,
    private imagePicker: ImagePicker
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
      .catch(_ => this.presentToast('Ha ocurrido un error guardando el color'))
      .finally(() => this.loading = false);
  }

  private async archive() {
    this.loading = true;
    (await this.alertCtrl.create({
      message: 'La nota va a ser archivada, ¿Desea continuar?',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.continueArchive();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.loading = false;
          }
        }
      ]
    })).present();
  }

  private continueArchive() {
    this.service
    .archive(this.data)
    .then(() => {
      this.presentToast('La nota ha sido archivada');
      this.navCtrl.back();
    })
    .catch(_ => this.presentToast('Ha ocurrido un error archivando la ntoa'))
    .finally(() => (this.loading = false));
  }
  private edit() {
    this.loading = true;
    this.router.navigate(['/my-notes/edit', this.data.id])
      .catch(() => this.presentToast('Ha ocurrido un error'));
  }

  private async unarchive() {
    this.loading = true;
    (await this.alertCtrl.create({
      message: 'La nota va a ser recuperada, ¿Desea continuar?',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.continueUnarchive();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.loading = false;
          }
        }
      ]
    })).present();
  }
  private continueUnarchive() {
    this.loading = true;
    this.service
      .unarchive(this.data)
      .then(() => {
        this.presentToast('La nota ha sido recuperada');
        this.navCtrl.back();
      })
      .catch(_ => this.presentToast('Ha ocurrido un error'))
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
        this.presentToast('La imagen se ha eliminado correctamente');
      })
      .catch(_ => this.presentToast('Ha ocurrido un error eliminando la imagen'))
      .finally(() => this.loading = false);
  }

  private pickImage() {
    const options: ImagePickerOptions = {
    quality: 100,
    outputType: 1
    };
    if (!this.data.images) {
      this.data.images = [];
    }
    const newImages = [...this.data.images];
     this.imagePicker.getPictures(options).then((imageData) => {
       const imagesSelected = imageData && !Array.isArray(imageData) ? [imageData] : (imageData || []);
       imagesSelected.forEach(image => {
        const base64Image = 'data:image/jpeg;base64,' + image;
        newImages.push(base64Image);
       });
       this.service.save({
          ...this.data,
          images: newImages
        })
          .then(() => this.data.images = newImages)
          .catch(_ => this.presentToast('Ha ocurrido un error guardando la imagen'))
          .finally(() => this.loading = false);

      }, (err) => {
        this.presentToast('Ha ocurrido un error');
      });
      }

  private  switchColorPalette() {
      this.showColorSelector = true;
    }

    private async delete() {
      this.loading = true;
      (await this.alertCtrl.create({
        message: 'La nota va a ser eliminada, ¿Desea continuar?',
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
              this.continueDelete();
            }
          },
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              this.loading = false;
            }
          }
        ]
      })).present();
    }
  private continueDelete() {
    this.loading = true;
    this.service.delete(this.data)
    .catch(_ => this.presentToast('Ha ocurrido un error eliminando la nota'))
    .finally(() => {
      this.loading = false;
      this.presentToast('La nota ha sido borrada');
      this.navCtrl.back();
    });
  }

  private async presentToast(message) {
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
