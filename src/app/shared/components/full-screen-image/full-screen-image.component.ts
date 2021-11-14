import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { createAnimation } from '@ionic/core';

@Component({
  selector: 'app-full-screen-image',
  templateUrl: './full-screen-image.component.html',
  styleUrls: ['./full-screen-image.component.scss'],
})
export class FullScreenImageComponent implements OnInit, OnChanges {
  @Input() srcImage: string;
  currentImage: string;
  constructor() { }

  ngOnInit() {}

  ngOnChanges() {
    if (!this.srcImage && this.currentImage) {
      createAnimation()
      .addElement(document.querySelector('.full-screen-img'))
      .duration(350)
      .fromTo('opacity', '1', '0')
      .afterStyles({ opacity: '0', 'z-index': -1 })
      .play().then(_ => this.currentImage = '');
    }
    if (this.srcImage) {
      this.currentImage = this.srcImage;
      createAnimation()
      .addElement(document.querySelector('.full-screen-img'))
      .duration(350)
      .fromTo('opacity', '0', '1')
      .beforeStyles({opacity: '0', 'z-index': 5})
      .afterStyles({ opacity: '1', 'z-index': 5})
      .play();
    }
  }

}
