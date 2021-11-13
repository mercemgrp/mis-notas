import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ConfigService } from 'src/app/shared/services/config.service';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.page.html',
  styleUrls: ['./colors.page.scss'],
})
export class ColorsPage implements OnInit {
  colorsData = [];
  form: FormGroup;
  loading = false;
  selected = false;
  constructor(
    private formBuilder: FormBuilder,
    private configService: ConfigService,
    private toastController: ToastController) { }

  ngOnInit() {
    this.form = this.formBuilder.group({});
    this.colorsData = this.configService.getColorsData();
    this.colorsData.forEach(c => {
      this.form.addControl(c.id, new FormControl(c.title));
    });
  }
  onSwitch(ascendant) {
    this.loading = true;
    this.configService.switchColor(this.selected, ascendant)
      .then(colors => this.colorsData = colors)
      .catch(_ => this.presentToast('Ha ocurrido un error'))
      .finally(() => this.loading = false);
  }
  onSelectColor(e: Event, id) {
    e?.stopPropagation();
    e?.preventDefault();
    this.selected = this.selected !== id ? id : undefined;
  }
  onSave() {
    this.loading = true;
    const val = this.form.value;
    this.configService.setColorsData(val)
      .then(_ => this.presentToast('Se han guardado los cambios'))
      .catch(_ => this.presentToast('Ha ocurrido un error'))
      .finally(() => {
        this.loading = false;
        this.selected = false;
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
