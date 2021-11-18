import {  Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IonBackButtonDelegate, IonInput, NavController } from '@ionic/angular';
import { ConfigService } from 'src/app/core/services/config.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ColorUi } from 'src/app/shared/models/configuration-ui';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.page.html',
  styleUrls: ['./colors.page.scss'],
})
export class ColorsPage implements OnInit {
  @ViewChild(IonBackButtonDelegate) backButton: IonBackButtonDelegate;
  @ViewChildren(IonInput) inputs: QueryList<IonInput>;

  get fontSize() {
    return this.configService.fontSize;
  }
  colorsData: ColorUi[] = [];
  form: FormGroup;
  loading = false;
  idSelected: string;
  constructor(
    private formBuilder: FormBuilder,
    private configService: ConfigService,
    private utilsServ: UtilsService,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.form = this.formBuilder.group({});
    this.colorsData = this.configService.getColorsData();
    this.colorsData.forEach(c => {
      this.form.addControl(c.id, new FormControl(c.title));
    });
    setTimeout(() => {
      this.setUIBackButtonAction();
    });
  }

  ionViewDidEnter() {
    this.focusContent();
  }

  onUnselect() {
    this.idSelected=undefined;
  }

  onSwitch(ascendant) {
    this.loading = true;
    this.configService.switchColor(this.idSelected, ascendant)
      .then(colors => this.colorsData = colors)
      .catch(_ => this.utilsServ.showToast('Ha ocurrido un error', true))
      .finally(() => this.loading = false);
  }
  onSelectColor(e: Event, id) {
    if (this.idSelected) {
      return;
    }
    e?.stopPropagation();
    e?.preventDefault();
    this.idSelected = this.idSelected !== id ? id : undefined;
  }
  onSave() {
    this.loading = true;
    const val = this.form.value;
    return this.configService.setColorsData(val)
      .then(_ => this.utilsServ.showToast('Se han guardado los cambios'))
      .catch(_ => this.utilsServ.showToast('Ha ocurrido un error', true))
      .finally(() => {
        this.loading = false;
        this.idSelected = '';
      });
  }

  private focusContent() {
    setTimeout(() => {
      this.inputs.first.getInputElement().then(
        inp =>  inp.setSelectionRange(this.colorsData[0].title.length, this.colorsData[0].title.length));
      this.inputs.first.setFocus();
      this.form.markAsUntouched();
    });
  }

  private setUIBackButtonAction() {
    this.backButton.onClick = () => {
      this.onSave().then(() => this.navCtrl.back());
    };
  }

}
