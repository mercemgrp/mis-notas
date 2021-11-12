import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonTextarea } from '@ionic/angular';
import { MyNote } from '../../models/my-note';

@Component({
  selector: 'app-my-note-edit',
  templateUrl: './my-note-edit.component.html',
  styleUrls: ['./my-note-edit.component.scss'],
})
export class MyNoteEditComponent implements OnInit {
  @ViewChild(IonTextarea) textarea: IonTextarea;
  @Input() data: MyNote;
  editForm: FormGroup;
  constructor(private fb: FormBuilder) { }
  ngOnInit() {
    this.editForm = this.fb.group({
      title: [this.data.title],
      content: [this.data.content]
    });
    this.focusContent();
  }
  focusContent() {
    setTimeout(() => {
      this.textarea.setFocus();
      this.textarea.getInputElement().then(txtarea => txtarea.setSelectionRange(this.data.content.length, this. data.content.length));

    }, 800);
  }
  
  onSubmit(): Promise<Object> {
    return new Promise((resolve, reject) => {
      if (this.editForm.valid) {
        resolve(this.editForm.getRawValue());
      } else {
        reject('Error! Faltan datos');
      }
    });

  }


}
