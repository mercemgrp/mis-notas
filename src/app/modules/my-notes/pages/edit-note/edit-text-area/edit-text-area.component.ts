import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonTextarea } from '@ionic/angular';
import { ConfigService } from 'src/app/core/services/config.service';
import { MyNoteUi } from 'src/app/shared/models/my-note';

@Component({
  selector: 'app-edit-text-area',
  templateUrl: './edit-text-area.component.html',
  styleUrls: ['./edit-text-area.component.scss'],
})
export class EditTextAreaComponent implements OnInit {
  @ViewChild(IonTextarea) textarea: IonTextarea;
  @Input() data: MyNoteUi;
  editForm: FormGroup;
  get fontSize() {
    return this.config.fontSize;
  }
  constructor(private config: ConfigService, private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
    this.focusContent();
  }

  onSubmit(): Promise<{
    content: string;
  }> {
    return new Promise((resolve, reject) => {
      if (this.editForm.valid) {
          resolve({
            ...this.editForm.getRawValue()
          });
      } else {
        reject('Error! Faltan datos');
      }
    });
  }
  private createForm() {
    this.editForm = this.fb.group({
      content: [this.data.content, [Validators.required]]
    });
  }

  private focusContent() {
    setTimeout(() => {
      this.textarea?.setFocus();
      this.textarea?.getInputElement().then(txtarea =>
          txtarea.setSelectionRange(txtarea.value ? txtarea.value.length : 0, txtarea.value ? txtarea.value.length : 0));
    }, 800);
  }

}
