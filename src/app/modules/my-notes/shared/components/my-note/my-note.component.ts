import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ConfigService } from 'src/app/core/services/config.service';
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
    this.content = this.data.title ? ` <b> ${this.data.title}</b><br />` : '';
    this.data.listItems.forEach(item => {
      this.content += item.checked ? '<div class="line-through" >' + item.item + '</div>' : item.item + '<br />';
    });
  }
  private renderTextArea() {
    this.content = this.data.content;
    this.content = this.convertLink(this.content, 'http://', 0);
    this.content = this.convertLink(this.content, 'https://', 0);
    this.content = this.content.replace(/\n/g, '<br />');
    if (this.isFullPage) {
      setTimeout(() => {
        const elements = document.getElementsByClassName('link');
        for (let el = 0; el < elements.length; el++) {
          elements.item(el).addEventListener('click', this.openUrl.bind(this ,elements.item(el).innerHTML));
        }
      });
    }
  }

  private convertLink(text: string, indexSearched, position) {
    const index = text.indexOf(indexSearched, position);
    if (index === -1 || position >= text.length) {
      return text;
    }
    const textBefore = text.substring(0, index);
    const indexOfSpace = text.indexOf(' ', index) > -1 ? text.indexOf(' ', index) : undefined;
    const indexOfOtherLine = text.indexOf('\n', index) > -1 ? text.indexOf('\n', index) : undefined;
    let indexEnd = 0;
    if (indexOfSpace !== undefined && indexOfOtherLine !== undefined) {
      indexEnd = indexOfSpace > indexOfOtherLine ? indexOfOtherLine : indexOfSpace;
    } else if( indexOfSpace !== undefined) {
      indexEnd = indexOfSpace;
    } else if (indexOfOtherLine !== undefined) {
      indexEnd = indexOfOtherLine;
    }
    const link = text.substring(index, indexEnd);
    const textAfter = text.substring(indexEnd);
    const result = textBefore + `<span class="link">${link}</span>` + textAfter;
    return this.convertLink(result, indexSearched, result.lastIndexOf('</span>'));
  }
}
