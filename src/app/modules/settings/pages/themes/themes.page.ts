import {  Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IonBackButtonDelegate, IonInput, NavController } from '@ionic/angular';
import { ConfigService } from 'src/app/core/services/config.service';
import { MyNotesService } from 'src/app/core/services/my-notes.service';
import { StaticUtilsService } from 'src/app/core/services/static-utils.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { COLORS } from 'src/app/shared/constants/colors';
import { ThemeUi } from 'src/app/shared/models/configuration-ui';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.page.html',
  styleUrls: ['./themes.page.scss'],
})
export class ThemesPage implements OnInit {
  @ViewChild(ModalComponent) colorSelectorModalCmp: ModalComponent;
  @ViewChild(IonBackButtonDelegate) backButton: IonBackButtonDelegate;
  @ViewChildren(IonInput) inputs: QueryList<IonInput>;

  get fontSize() {
    return this.configService.fontSize;
  }
  themesData: ThemeUi[] = [];
  // form: FormGroup;
  changes = false;
  loading = false;
  showThemeEditor = false;
  themeSelected: ThemeUi;
  constructor(
    private formBuilder: FormBuilder,
    private configService: ConfigService,
    private utilsServ: UtilsService,
    private navCtrl: NavController,
    private myNotesServ: MyNotesService)  { }

  ngOnInit() {
    this.themesData = this.configService.getThemesData();
   // this.createForm();
    setTimeout(() => {
      this.setUIBackButtonAction();
    });
  }

  ionViewDidEnter() {
   // this.focusContent();
  }
  onCloseColorSelector() {
    this.showThemeEditor = false;
  }
  async onDelete() {
    if(this.myNotesServ.getActived(this.themeSelected.themeId).length > 0) {
      await this.utilsServ.showBasicAlert('No puede borrar la temática porque hay notas que la tienen asignada');
    } else if(this.myNotesServ.getArchived(this.themeSelected.themeId).length > 0) {
      await this.utilsServ.showBasicAlert('No puede borrar la temática porque hay notas archivadas que la tienen asignada');
    } else {
      this.loading = true;
      this.utilsServ.showAlert('Va a eliminar la temática, desea continuar?').then(data => {
        if (data.role === 'cancel') {
          this.loading = false;
        } else {
        //  this.updateDataFromForm();
          this.continueDelete(this.themeSelected.themeId);
        }
      });
    }
  }

  onEdit() {
    this.showThemeEditor = true;
  }
  onEditTheme(data: {colorId: string; title: string}) {
    if (!data.colorId || !data.title) {
      this.utilsServ.showToast('Seleccione un color y añada un título', true);
      return;
    }
    if (this.themeSelected) {
      this.themeSelected = {
        ...this.themeSelected,
        ...COLORS[data.colorId],
        themeTitle: data.title
      };
      const themeIndex = this.themesData.findIndex(theme => theme.themeId === this.themeSelected.themeId);
        this.themesData[themeIndex] = {...this.themeSelected};
    } else {
      const themeId = StaticUtilsService.getRandomId();
      this.themesData.push({
        themeId,
        themeTitle: data.title,
        colorId: data.colorId,
        c1: COLORS[data.colorId].c1,
        c2: COLORS[data.colorId].c2,
        themePosition: this.themesData.reduce((result, theme) =>
          (theme.themePosition > result ? theme.themePosition : result) , 0) + 1
      });
    //  this.form.addControl(themeId, new FormControl('',  [Validators.required]));
    }
    this.themesData = [...this.themesData];
    this.themeSelected = null;
    this.onSave();
    this.onCloseColorSelector();
  }


  onAddTheme(ev) {
    ev?.stopPropagation();
    this.themeSelected = null;
    this.showThemeEditor = true;
   // this.updateDataFromForm();
  }
  onUnselect() {
    this.themeSelected = null;
    if (this.showThemeEditor) {
      this.colorSelectorModalCmp.onHide();
    }
  }

  onSwitch(ascendant) {
    this.loading = true;
    const indexTheme1 = this.themesData.findIndex(th => th.themeId === this.themeSelected.themeId);
    const indexTheme2 = ascendant ? indexTheme1 - 1 : indexTheme1 + 1;
    this.configService.switchTheme(this.themesData[indexTheme1], this.themesData[indexTheme2])
      .then(themes => this.themesData = themes)
      .catch(_ => this.utilsServ.showToast('Ha ocurrido un error', true))
      .finally(() => this.loading = false);
  }
  onSelectTheme(e: Event, theme: ThemeUi) {
    e?.stopPropagation();
    e?.preventDefault();
      this.themeSelected = theme;
  }
  onSave() {
    this.loading = true;
   // this.updateDataFromForm();
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
        this.themesData = this.themesData.filter(theme => theme.themeId !==  themeId);
        this.onUnselect();
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

}
