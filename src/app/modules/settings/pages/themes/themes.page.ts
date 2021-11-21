import {  Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IonBackButtonDelegate, IonInput, NavController } from '@ionic/angular';
import { ConfigService } from 'src/app/core/services/config.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ThemeUi } from 'src/app/shared/models/configuration-ui';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.page.html',
  styleUrls: ['./themes.page.scss'],
})
export class ThemesPage implements OnInit {
  @ViewChild(IonBackButtonDelegate) backButton: IonBackButtonDelegate;
  @ViewChildren(IonInput) inputs: QueryList<IonInput>;

  get fontSize() {
    return this.configService.fontSize;
  }
  themesData: ThemeUi[] = [];
  form: FormGroup;
  changes = false;
  loading = false;
  idSelected: string;
  constructor(
    private formBuilder: FormBuilder,
    private configService: ConfigService,
    private utilsServ: UtilsService,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.themesData = this.configService.getThemesData();
    this.createForm();
    setTimeout(() => {
      this.setUIBackButtonAction();
    });
  }

  ionViewDidEnter() {
    this.focusContent();
  }

  onUnselect() {
    this.idSelected='';
  }

  onSwitch(ascendant) {
    this.loading = true;
    this.configService.switchTheme(this.idSelected, ascendant)
      .then(themes => this.themesData = themes)
      .catch(_ => this.utilsServ.showToast('Ha ocurrido un error', true))
      .finally(() => this.loading = false);
  }
  onSelectTheme(e: Event, id) {
    e?.stopPropagation();
    e?.preventDefault();
    this.idSelected = this.idSelected !== id ? id : undefined;
  }
  onSave() {
    this.loading = true;
    const val = this.form.value;
    return this.configService.setThemesData(val)
      .then(_ => this.utilsServ.showToast('Se han guardado los cambios'))
      .catch(_ => this.utilsServ.showToast('Ha ocurrido un error', true))
      .finally(() => {
        this.loading = false;
        this.changes = false;
        this.onUnselect();
      });
  }

  private focusContent() {
    setTimeout(() => {
      this.inputs.first.getInputElement().then(
        inp =>  inp.setSelectionRange(this.themesData[0].themeTitle.length, this.themesData[0].themeTitle.length));
      this.inputs.first.setFocus();
      this.form.markAsUntouched();
    });
  }

  private setUIBackButtonAction() {
    this.backButton.onClick = () => {
      if (this.changes) {
        this.onSave().then(() => this.navCtrl.back());
      } else {
        this.navCtrl.back();
      }
    };
  }

  private createForm() {
    this.form = this.formBuilder.group({});
    this.themesData.forEach(c => {
      this.form.addControl(c.themeId, new FormControl(c.themeTitle));
    });
    this.form.valueChanges.subscribe(() => this.changes = true);
  }

}
