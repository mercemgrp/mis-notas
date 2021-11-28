import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';
import { MONTHS_NAMES } from '../../constants/months-names';
import { WEEK_DAYS } from '../../constants/weeks-days';

const MAX_NUMBER_OF_ROWS = 6;
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input() notifications: {
    date: Date;
    color: string;
  }[] = [];
  @Input() currentDate: Date = new Date();
  @Output() selectDateEv = new EventEmitter<Date>();
  get fontSize() {
    return this.config.fontSize;
  }
  get firstWeekDay() {
    const currentDate =  new Date(this.currentBaseDate.getTime());
    return new Date(`${currentDate.getFullYear()}-${currentDate.getMonth()+1}-01`).getDay();
  }
  get lastWeekDay() {
    const currentDate = new Date(this.currentBaseDate.getTime());
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(0);
    return new Date(`${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()}`).getDay();
  }
  get lastDayOfMonth() {
    const currentDate = new Date(this.currentBaseDate.getTime());
    currentDate.setMonth(currentDate.getMonth() + 1);
   currentDate.setDate(0);
    return currentDate.getDate();
  }
  monthName = '';
  year;
  calendar: {day: number; enabled: boolean; notifications: []}[][] = [];
  currentBaseDate: Date;
  checkedDay: number;
  today: number;
  weeksDays = WEEK_DAYS;

  constructor(private config: ConfigService) { }

  ngOnInit() {
    this.currentBaseDate = this.firstDayOfMonth(this.currentDate);
    this.setVariables();
    this.renderCalendar();
    console.log('loaded');

  }

  onBack() {
    const pastMonth = this.currentBaseDate.getMonth()-1;
    this.currentBaseDate.setMonth(pastMonth);
    this.currentBaseDate = this.firstDayOfMonth(this.currentBaseDate);
    this.setVariables();
    this.renderCalendar();
  }

  onFordward() {
    const nextMonth = this.currentBaseDate.getMonth()+1;
    this.currentBaseDate.setMonth(nextMonth);
    this.currentBaseDate = this.firstDayOfMonth(this.currentBaseDate);
    this.setVariables();
    this.renderCalendar();
  }

  onSelectDay(day) {
    if (!day) {
      return;
    }
    const date = new Date(`${this.currentBaseDate.getFullYear()}-${this.currentBaseDate.getMonth()+1}-${day}`);
    this.checkedDay = day;
    this.selectDateEv.emit(date);
  }

  private setVariables() {
    this.checkedDay = undefined;
    this.today = undefined;
    const today = new Date();
    if (today.getMonth() === this.currentBaseDate.getMonth() && today.getFullYear() === this.currentBaseDate.getFullYear()) {
      this.today = today.getDate();
    }
    this.monthName = MONTHS_NAMES[this.currentBaseDate.getMonth()];
    this.year = this.currentBaseDate.getFullYear();
  }
  private firstDayOfMonth(date: Date) {
    const currentDate = new Date(date.getTime());
    return new Date(`${currentDate.getFullYear()}-${currentDate.getMonth()+1}-01`);
  }

  private renderCalendar() {
    this.calendar = [];
    const firstWeekDay = this.firstWeekDay;
    const lastDay = this.lastDayOfMonth;
    const lastWeekDay = this.lastWeekDay;
    const daysLeftFirstWeek = firstWeekDay - 1;
    const daysLeftLastWeek = 7 - lastWeekDay;
    let numberOfWeeks = (lastDay + daysLeftFirstWeek + daysLeftLastWeek) / 7;
    numberOfWeeks = numberOfWeeks === +numberOfWeeks ? +numberOfWeeks : Math.trunc(numberOfWeeks) + 1 + 7 - lastWeekDay;
    let currentPosition = 0;
    const firstWeekDayInFirstRow = firstWeekDay - 1;
    let lastWeekDayInRow;
    for (let week=0;week<numberOfWeeks; week++) {
      this.calendar[currentPosition] = [];
      const firstDayRow = (week * 7) + 1 - daysLeftFirstWeek;
      const lastDayRow = firstDayRow + 7 - 1;
      const firstWeekDayInRow = week === 0 ? firstWeekDayInFirstRow : 0;
      lastWeekDayInRow = lastDayRow < lastDay ? 7 : lastDay - firstDayRow +1 ;
      for (let weekDay=firstWeekDayInRow; weekDay<lastWeekDayInRow; weekDay++){
        this.calendar[currentPosition][weekDay] = {
          day: firstDayRow + weekDay,
          enabled: this.year > new Date().getFullYear() ||
          (this.year === new Date().getFullYear() && this.currentBaseDate.getMonth() > new Date().getMonth()) ||
          (this.year === new Date().getFullYear() && this.currentBaseDate.getMonth() === new Date().getMonth()) &&
          firstDayRow + weekDay >= new Date().getDate(),
          notifications: []
        };
      }
      currentPosition++;
    }
    if (this.calendar[currentPosition-1].length < 7) {
      for (let i = this.calendar[currentPosition-1].length; i < 7; i++) {
        this.calendar[currentPosition-1][i] = undefined;
      }
    }
    for(let i=currentPosition; i<MAX_NUMBER_OF_ROWS;  i++) {
      this.calendar[i] = [undefined,undefined,undefined,undefined,undefined,undefined,undefined];
    }
  }

}
