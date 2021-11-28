import { MONTHS_NAMES } from 'src/app/shared/constants/months-names';
import { ListItem } from 'src/app/shared/models/my-note';


export  class StaticUtilsService {

  constructor() { }

  public static copyDeep(oldCopy: any): any {
    if (!oldCopy) {
      return null;
    }
    const newCopy = JSON.parse(JSON.stringify(oldCopy));
    return newCopy;
  }

  public static getRandomId() {
    return Math.random()
      .toString()
      .replace('.', '');
  }

  public static getDateStr(date: Date) {
    if (!date) {
      return '';
    }
    return `${this.getDate(date)} a las ${this.getTime(date)}`;
  }

  public static getDate(date: Date) {
    return `${date.getDate()} de ${MONTHS_NAMES[date.getMonth()]} del ${date.getFullYear()} `;
  }

  public static getTime(date: Date) {
    if (!date) {
      return '';
    }
    const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return `${hours}:${minutes}`;
  }
  public static getListItemsPlainText(title: string, list: ListItem[]) {
    let content = title ? ` <b> ${title}</b><br />` : '';
    list.forEach(item => {
      content += item.checked ? '<strike>' + item.item + '</strike><br />' : item.item + '<br />';
    });
    return content;
  }
  public static getFormattedText(content) {
    return this.getText(content ||'', false);
  }
  private static getText(content, plainText?) {
    let contentEnd = content;
    contentEnd = this.convertLink(contentEnd, 'http://', 0, plainText);
    contentEnd = this.convertLink(contentEnd, 'https://', 0, plainText);
    contentEnd = contentEnd.replace(/\n/g, '<br />');
    return contentEnd;
  }

  private static convertLink(text: string, indexSearched, position, plainText = true) {
    const index = text.indexOf(indexSearched, position);
    if (index === -1 || position >= text.length) {
      return text;
    }
    const textBefore = text.substring(0, index);
    const indexOfSpace = text.indexOf(' ', index) > -1 ? text.indexOf(' ', index) : undefined;
    const indexOfOtherLine = text.indexOf('\n', index) > -1 ? text.indexOf('\n', index) : undefined;
    let indexEnd = 0;
    if (indexOfSpace === undefined && indexOfOtherLine === undefined) {
      indexEnd = text.length;
    }
    else if (indexOfSpace !== undefined && indexOfOtherLine !== undefined) {
      indexEnd = indexOfSpace > indexOfOtherLine ? indexOfOtherLine : indexOfSpace;
    } else if( indexOfSpace !== undefined) {
      indexEnd = indexOfSpace;
    } else if (indexOfOtherLine !== undefined) {
      indexEnd = indexOfOtherLine;
    }
    const link = text.substring(index, indexEnd);
    const textAfter = text.substring(indexEnd);
    const result = textBefore + (plainText ? `<u>${link}</u>` : `<span class="link">${link}</span>`) + textAfter;
    return this.convertLink(result, indexSearched, result.lastIndexOf(plainText ? '</u>' : '</span>'));
  }

}
