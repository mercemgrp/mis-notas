import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { ConfigService } from 'src/app/core/services/config.service';
import { StaticUtilsService } from 'src/app/core/services/static-utils.service';
import { ListItem, MyNoteUi } from 'src/app/shared/models/my-note';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss'],
})
export class EditListComponent implements OnInit {
  @ViewChildren(IonInput) input: QueryList<IonInput>;
  @Input() data: MyNoteUi;
  editForm: FormGroup;
  get fontSize() {
    return this.config.fontSize;
  }
  title = '';
  listItems: ListItem[] = [];
  constructor(private config: ConfigService, private fb: FormBuilder) { }

  ngOnInit() {
      this.listItems = this.data.listItems || [];
      this.title = this.data.title;
      this.createForm();
      this.focusContent(true);
  }

  onSubmit(): Promise<{
    title: string;
    listItems: ListItem[];
  }> {
    return new Promise((resolve, reject) => {
      if (this.editForm.valid) {
          this.readForm();
          const itemsFiltered = this.listItems.filter(item => item.item);
          if (!itemsFiltered.length) {
            reject('¡Error! Añade al menos un elemento');
          }
          resolve({
            title: this.title,
            listItems: itemsFiltered
          });
      } else {
        reject('Error! Faltan datos');
      }
    });

  }
  onDelete(id) {
    this.readForm();
    this.listItems =  this.listItems.filter((item) => item.id !== id);
    this.editForm.removeControl(id);
  }
  onCheck(id) {
    const elem = this.listItems.find((item) => item.id === id );
    elem.checked = !elem.checked;
    if (elem.checked) {
      this.editForm.get(elem.id).disable();
     } else {
        this.editForm.get(elem.id).enable();
     }
  }
  addListItem() {
    const values = this.editForm.getRawValue();
    const allValuesArray: string[] = Object.values(values).filter((val, i) => i !== 0) as string[];
    if (allValuesArray.some(val => !val)) {
      return;
    }
    const id = StaticUtilsService.getRandomId();
      this.listItems.push({checked: false, item: '', id});
      this.editForm.addControl(id, new FormControl(''));
      this.focusContent();
  }

  onKeyup(e) {
      this.addListItem();
  }
  private readForm() {
    const valuesActived = Object.entries(this.editForm.value).filter(item => item[0] !== 'title').map(item => item[0]);
    const value = this.editForm.getRawValue();
    const list = Object.entries(value).filter(item => item[0] !== 'title');
    this.title = value.title;
    this.listItems = list.map((elem: [string, string]) => ({
        item: elem[1] || '', checked: !valuesActived.includes(elem[0]), id: elem[0]
      }));
  }
  private createForm() {
        const editForm = this.fb.group({
          title: [this.title]
        });
        this.listItems.forEach((item) => {
          editForm.addControl(item.id, new FormControl(item.item, []));
          if (item.checked) {
          editForm.get(item.id).disable();
          }
        });
        this.editForm = editForm;
        if (!this.listItems.length) {
          this.addListItem();
        }
  }

  private focusContent(init = false) {
    setTimeout(() => {
        this.input?.last?.setFocus();
        this.input?.last?.getInputElement().then(input => input.setSelectionRange(
          input.value.length,
          input.value.length));
    }, init ? 1000 : 250);
  }
}
