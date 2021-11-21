import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { ConfigService } from 'src/app/core/services/config.service';
import { MyNoteUi } from 'src/app/shared/models/my-note';

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
  listItems: {checked: boolean; item: string}[] = [];
  constructor(private config: ConfigService, private fb: FormBuilder) { }

  ngOnInit() {
        this.listItems = this.data.listItems || [];
        this.title = this.data.title;
      this.createForm();
      this.focusContent();
  }

  onSubmit(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.editForm.valid) {
          this.readForm();
          resolve({
            title: this.title,
            listItems: this.listItems
          });
      } else {
        reject('Error! Faltan datos');
      }
    });

  }
  onDelete(i) {
    this.readForm();

    this.listItems =  this.listItems.filter((item, index) => index !== i );
    setTimeout(() => {
      this.createForm();
    });
  }
  onCheck(i) {
    const elem = this.listItems.find((item, index) => index === i );
    elem.checked = !elem.checked;
    if (elem.checked) {
      this.editForm.get('item' +i).disable();
     } else {
        this.editForm.get('item' +i).enable();
     }
  }
  addListItem() {
    const values = this.editForm.getRawValue();
    const allValuesArray: string[] = Object.values(values).filter((val, i) => i !== 0) as string[];
    if (allValuesArray.some(val => !val)) {
      return;
    }
      this.listItems.push({checked: false, item: ''});
      this.editForm.addControl('item' + (this.listItems.length-1), new FormControl(''));
      this.focusContent();
  }

  onKeyup(e) {
      this.addListItem();
  }
  private readForm() {
    const value = this.editForm.getRawValue();
    this.title = value.title;
    this.listItems = this.listItems.map((item, index) => ({item: value['item'+index] || '', checked: item.checked}))
      .filter(item => item.item);
  }
  private createForm() {

        this.editForm = this.fb.group({
          title: [this.title]
        });
        this.listItems.forEach((item, i) => {
          this.editForm.addControl('item' + i, new FormControl(item.item, []));
          if (item.checked) {
          this.editForm.get('item' + i).disable();
          }
        });
        if (!this.listItems.length) {
          this.addListItem();
        }
  }

  private focusContent() {
    setTimeout(() => {
        this.input?.last?.setFocus();
        this.input?.last?.getInputElement().then(input => input.setSelectionRange(
          input.value.length,
          input.value.length));
    }, 800);
  }
}
