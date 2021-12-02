import { Injectable } from '@angular/core';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor(
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private imagePicker: ImagePicker,
    private configServ: ConfigService) {}

    async showBasicAlert(message): Promise<any> {
      const alert = await this.alertCtrl.create({
        cssClass:  `u-txt-${this.configServ.fontSize}`,
        message,
        buttons: [
          {
            text: 'Aceptar',
            role: 'ok',
            handler: () => true
          }
        ]
      });
      await alert.present();
      return alert.onDidDismiss();
    }
  async showAlert(message): Promise<any> {
    const alert = await this.alertCtrl.create({
      cssClass:  `u-txt-${this.configServ.fontSize}`,
      message,
      buttons: [
        {
          text: 'Aceptar',
          role: 'ok',
          handler: () => true
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => false
        }
      ]
    });
    await alert.present();
    return alert.onDidDismiss();
  }

  async showToast(message, isError = false, duration = 2000) {
    const toast = await this.toastController.create({
      color: isError ? 'danger' : 'dark',
      animated: true,
      cssClass: ['my-toast', `u-txt${this.configServ.fontSize}` ],
      message,
      duration
    });
    toast.present();
  }

  pickImage(): Promise<string[]> {
    const options: ImagePickerOptions = {
    quality: 100,
    outputType: 1
    };
    const images: string[] = [];
     return this.imagePicker.getPictures(options).then((imageData) => {
       const imagesSelected = imageData && !Array.isArray(imageData) ? [imageData] : (imageData || []);
       imagesSelected.forEach(image => {
        const base64Image = 'data:image/jpeg;base64,' + image;
        images.push(base64Image);
      });
      return images;
    });
  }
}

