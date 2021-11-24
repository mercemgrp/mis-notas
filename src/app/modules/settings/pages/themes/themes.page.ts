import {  Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IonBackButtonDelegate, IonInput, NavController } from '@ionic/angular';
import { ConfigService } from 'src/app/core/services/config.service';
import { MyNotesService } from 'src/app/core/services/my-notes.service';
import { StaticUtilsService } from 'src/app/core/services/static-utils.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { COLORS } from 'src/app/shared/constants/colors';
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
  showColorSelector = false;
  idSelected: string;
  constructor(
    private formBuilder: FormBuilder,
    private configService: ConfigService,
    private utilsServ: UtilsService,
    private navCtrl: NavController,
    private myNotesServ: MyNotesService)  { }

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
  onCloseColorSelector() {
    this.showColorSelector = false;
  }
  async onDelete(themeId) {
    if(this.myNotesServ.getActived(themeId).length > 0) {
      await this.utilsServ.showBasicAlert('No puede borrar la temática porque hay notas que la tienen asignada');
    } else if(this.myNotesServ.getArchived(themeId).length > 0) {
      await this.utilsServ.showBasicAlert('No puede borrar la temática porque hay notas archivadas que la tienen asignada');
    } else {
      this.loading = true;
      this.utilsServ.showAlert('Va a eliminar la temática, desea continuar?').then(data => {
        if (data.role === 'cancel') {
          this.loading = false;
        } else {
          this.continueDelete(themeId);
        }
      });
    }
  }
  onSelectColor(colorId) {
    this.themesData.push({
      themeId: StaticUtilsService.getRandomId(),
      themeTitle: '',
      colorId,
      c1: COLORS[colorId].c1,
      c2: COLORS[colorId].c2,
      themePosition: this.themesData.reduce((result, theme) =>
        (theme.themePosition > result ? theme.themePosition : result) , 0) + 1
    });
    this.form.addControl(this.themesData[this.themesData.length-1].themeId, new FormControl('',  [Validators.required]));
    this.themesData = [...this.themesData];
    this.onCloseColorSelector();
  }


  onAddTheme() {
    if (!this.form.valid) {
      return;
    }
    this.showColorSelector = true;
    this.updateDataFromForm();
  }
  onUnselect() {
    this.idSelected='';
  }

  onSwitch(ascendant) {
    this.loading = true;
    const indexTheme1 = this.themesData.findIndex(th => th.themeId === this.idSelected);
    const indexTheme2 = ascendant ? indexTheme1 - 1 : indexTheme1 + 1;
    this.configService.switchTheme(this.themesData[indexTheme1], this.themesData[indexTheme2])
      .then(themes => this.themesData = themes)
      .catch(_ => this.utilsServ.showToast('Ha ocurrido un error', true))
      .finally(() => this.loading = false);
  }
  onSelectTheme(e: Event, id) {
    e?.stopPropagation();
    e?.preventDefault();
    if (!this.themesData.find(th => th.themeId === id).colorId) {
      this.idSelected = id;
      this.showColorSelector = true;
    } else {
      this.idSelected = this.idSelected !== id ? id : undefined;
    }
  }
  onSave() {
    if (!this.form.valid) {
      this.utilsServ.showToast('No puede añadir más temáticas, tienes que poner título a todas las temáticas añadidas por ti ');
      return;
    }
    this.loading = true;
    this.updateDataFromForm();
    return this.configService.setThemesData(this.themesData)
      .then(_ => this.utilsServ.showToast('Se han guardado los cambios'))
      .catch(_ => this.utilsServ.showToast('Ha ocurrido un error', true))
      .finally(() => {
        this.loading = false;
        this.changes = false;
        this.onUnselect();
      });
  }

  private continueDelete(themeId) {
    this.loading = true;
    this.configService.deleteTheme(themeId)
    .then(_ => this.utilsServ.showToast('Se ha eliminado la temática'))
    .catch(_ => this.utilsServ.showToast('Ha ocurrido un error', true))
      .finally(() => {
        this.loading = false;
        this.changes = false;
        this.themesData = this.themesData.filter(theme => theme.themeId !==  themeId);
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
    this.themesData.forEach((c, index) => {
      this.form.addControl(c.themeId, new FormControl(c.themeTitle,
        Object.keys(COLORS).includes(c.themeId) ? [] : [Validators.required]));
    });
    this.form.valueChanges.subscribe(() => this.changes = true);
  }

  private updateDataFromForm() {
    const values = this.form.value;
    const entries = Object.entries(values);
    entries.forEach(entry => {
      const currentTheme = this.themesData.find(theme => theme.themeId === entry[0]);
      if (currentTheme) {
        currentTheme.themeTitle = (entry[1] as string).trim();
      }
    });
  }

}
