import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ConfigService } from 'src/app/core/services/config.service';
import { StaticUtilsService } from 'src/app/core/services/static-utils.service';
import { MyNoteUi } from 'src/app/shared/models/my-note';

@Component({
  selector: 'app-my-note',
  templateUrl: './my-note.component.html',
  styleUrls: ['./my-note.component.scss']
})
export class MyNoteComponent implements OnChanges {
  get fontSize() {
    return this.configServ.fontSize;
  }
  get contentHtml() {
    return this.content;
  }
  @Input() data: MyNoteUi;
  @Input() isFullPage;
  @Input() showTitle: boolean;
  @Output() clickEv = new EventEmitter();
  border;
  content: string;
  constructor(private iab: InAppBrowser, private configServ: ConfigService) {}

  ngOnChanges() {
    this.border = this.isFullPage ? this.data.c2 : '';
    this.renderContent();
  }

  onClick() {
    this.clickEv.emit();
  }
  openUrl(url: string, event) {
    event?.stopPropagation();
    if (url.startsWith('www.')) {
      url = 'http://' + url;
    }
    this.iab.create(url, '_system');
  }

  private renderContent() {
    switch (this.data.type) {
      case 1:
        this.renderTextArea();
        break;
      case 2:
        this.renderList();
        break;
      default:
        this.renderTextArea();
        break;
    }
  }

  private renderList() {
    this.content = StaticUtilsService.getListItemsPlainText(this.data.title, this.data.listItems);
  }
  private renderTextArea() {
    this.content = StaticUtilsService.getFormattedText(this.data.content);
    if (this.isFullPage) {
      setTimeout(() => {
        const elements = document.getElementsByClassName('link');
        for (let el = 0; el < elements.length; el++) {
          elements.item(el).addEventListener('click', this.openUrl.bind(this ,elements.item(el).innerHTML));
        }
      });
    }
  }

}
