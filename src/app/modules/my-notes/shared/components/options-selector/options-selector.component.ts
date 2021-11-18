
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { createAnimation } from '@ionic/core';
import { COLORS } from 'src/app/shared/constants/colors';
import { HEADER_HEIGHT } from '../../../../../shared/constants/header-px';

@Component({
  selector: 'app-options-selector',
  templateUrl: './options-selector.component.html',
  styleUrls: ['./options-selector.component.scss']
})
export class OptionsSelectorComponent implements OnInit {
  @Output() selectColorEv = new EventEmitter<string>();
  @Output() closeEv = new EventEmitter();
  colors = [];
  ngOnInit() {
    const entries = Object.entries(COLORS);
    this.colors = entries.map(value =>value[1] );
    this.show();
  }

  onHide(ev?: Event) {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    this.hide();
  }

  onSelectStyle(color) {
    this.hide(color);
  }

  private show() {
    createAnimation()
      .addElement(document.querySelector('.options-selector'))
      .duration(350)
      .fromTo('opacity', '0', '1')
      .beforeStyles({ opacity: '0', 'z-index': 5 })
      .play()
      .then(() => {
        createAnimation()
          .addElement(document.querySelector('.options-selector__content'))
          .duration(350)
          .fromTo('top', '-50%', '0%')
          .play();
      });
  }

  private hide(colorId?) {
    createAnimation()
      .addElement(document.querySelector('.options-selector__content'))
      .duration(350)
      .fromTo('margin-top', `${HEADER_HEIGHT}px`, '0px')
      .fromTo('top', '0%', '-50%')
      .play()
      .then(() => {
        createAnimation()
          .addElement(document.querySelector('.options-selector'))
          .duration(350)
          .fromTo('opacity', '', '0')
          .afterStyles({'z-index': -1})
          .play()
          .then(() => {
            if (colorId) {
              this.selectColorEv.emit(colorId);
            }
            this.closeEv.emit();
          });
      });
  }
}
