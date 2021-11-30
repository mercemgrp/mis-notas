import { Component, EventEmitter, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
 @ViewChildren(IonInput) inputs: QueryList<IonInput>;
 @Output() cancelEv = new EventEmitter();
 @Output() acceptEv = new EventEmitter<Date>();
  form: FormGroup;
  date: Date;
  loaded = false;
  constructor(
    private fb: FormBuilder,
    private utils: UtilsService) { }

  ngOnInit() {
    setTimeout(() => {
      this.loaded = true;
    }, 1000);
    this.form = this.fb.group({
      hours: ['', Validators.required],
      minutes: ['', Validators.required],
    });
    this.form.get('hours').valueChanges
    .pipe(tap(((val: any) => {
      if(val.length === 2 || +val > 2) {
        this.inputs.last.setFocus();
      }
    })))
    .subscribe();
  }

  onSelectDate(date: Date) {
    this.date = date;
    this.inputs.first.setFocus();
  }

  onAccept() {
    const value = this.form.value;
    if (!this.date) {
      this.utils.showToast('Seleccione una fecha', true);
    } else if (!this.form.valid || value.hours < 0 || value.hours > 23 || value.minutes < 0 || value.minutes > 59) {
      this.utils.showToast('Indique una hora correcta', true);
    } else {
      this.date.setHours(+value.hours);
      this.date.setMinutes(+value.minutes);
      this.date.setSeconds(0);
      if (this.date < new Date()) {
        this.utils.showToast('No puede añadir una notificación para una fecha pasada', true);
      } else {
        this.acceptEv.emit(this.date);
      }
    }
  }

  onCancel() {
    this.cancelEv.emit();

  }

}
