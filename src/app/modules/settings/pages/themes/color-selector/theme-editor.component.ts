
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';
import { COLORS } from 'src/app/shared/constants/colors';
import { ThemeUi } from 'src/app/shared/models/configuration-ui';

@Component({
  selector: 'app-theme-editor',
  templateUrl: './theme-editor.component.html',
  styleUrls: ['./theme-editor.component.scss']
})
export class ThemeEditorComponent implements OnInit{
  @Input() data: ThemeUi;
  @Output() selectColorEv = new EventEmitter<{colorId: string; title: string}>();
  @Output() closeEv = new EventEmitter();
  fontSize;
  title;
  colors = [];
  colorSelected: string;
  constructor(private config: ConfigService) {}

  ngOnInit() {
    this.fontSize = this.config.fontSize;
    this.colors = Object.values(COLORS);
    this.colorSelected = this.data?.colorId;
    this.title = this.data?.themeTitle;
  }


  onSelectStyle(colorId) {
    this.colorSelected  = colorId;
  }

  onAccept() {
    this.selectColorEv.emit({colorId: this.colorSelected, title: this.title});
  }

  onCancel() {
    this.closeEv.emit();
  }


}
