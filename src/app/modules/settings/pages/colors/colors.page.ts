import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ConfigService } from 'src/app/core/services/config.service';
import { UtilsService } from 'src/app/core/services/shell.service';

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
    private utilsServ: UtilsService) { }

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
      .catch(_ => this.utilsServ.showToast('Ha ocurrido un error'))
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
      .then(_ => this.utilsServ.showToast('Se han guardado los cambios'))
      .catch(_ => this.utilsServ.showToast('Ha ocurrido un error'))
      .finally(() => {
        this.loading = false;
        this.selected = false;
      });
  }

}
