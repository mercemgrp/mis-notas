import { AnimationController } from '@ionic/angular';
const animationCtrl = new AnimationController();

export const getIonPageElement = (element: HTMLElement) => {
  if (element.classList.contains('ion-page')) {
    return element;
  }

  const ionPage = element.querySelector(':scope > .ion-page, :scope > ion-nav, :scope > ion-tabs');
  if (ionPage) {
    return ionPage;
  }
  // idk, return the original element so at least something animates and we don't have a null pointer
  return element;
};
export const getIonPageContentElement = (element: HTMLElement) => {
  const page = getIonPageElement(element);
  return page.querySelector('.ion-page > ion-content');
};

export const getIonToolbarHeaderElement = (element: HTMLElement) => {
  const page = getIonPageElement(element);
  return page.querySelector('.ion-page ion-header ion-toolbar.toolbar-custom');
};
export const getIonFaviconElement = (element: HTMLElement) => {
  const page = getIonPageElement(element);
  return page.querySelector('.ion-page ion-fab');
};
export const fancyAnimation = (_: HTMLElement, opts: any) => {
  const backDirection = opts.direction === 'back';
  const enteringEl = opts.enteringEl;
  const leavingEl = opts.leavingEl;

  const rootTransition = animationCtrl.create();

  const enterTransition = animationCtrl.create();
  const enterContentTransition = animationCtrl.create();
  const leavingTransition = animationCtrl.create();
  const leavingContentTransition = animationCtrl.create();
  let leavingHeaderToolbarTransition;
  let enteringHeaderToolbarTransition;
  let leavingFabIconTransition;

   const leavingToolbar = getIonToolbarHeaderElement(leavingEl);
   const enteringToolbar = getIonToolbarHeaderElement(enteringEl);
   const leavingFabIcon = getIonFaviconElement(leavingEl);
   if (leavingToolbar && !enteringToolbar) {
    leavingHeaderToolbarTransition = animationCtrl.create()
    .addElement(leavingToolbar)
   // .keyframes([{ offset: 0, transform: 'translateY(0%)' }, { offset: 1, transform: 'translateY(-100%)' }])
    .fromTo('opacity', '1', '0')
    .beforeStyles({'z-index': '1'})
    .duration(300);
   }
   if (enteringToolbar && !leavingToolbar) {
    enteringHeaderToolbarTransition = animationCtrl.create()
    .addElement(enteringToolbar)
    // .keyframes([{ offset: 0, transform: 'translateY(-100%)' }, { offset: 1, transform: 'translateY(0%)' }])
    .fromTo('opacity', '0', '1')
    .beforeStyles({'z-index': '1'})
    .duration(300);
   }
   if (leavingFabIcon) {
    leavingFabIconTransition = animationCtrl.create()
    .addElement(leavingFabIcon)
 //   .beforeStyles({'margin-bottom': '5px'})
 //   .fromTo('margin-bottom', '5px', '-100px')
    .duration(300);
   }
   leavingContentTransition.addElement(getIonPageContentElement(leavingEl)).duration(300);
   enterContentTransition.addElement(getIonPageContentElement(enteringEl)).duration(300);
  leavingTransition.addElement(getIonPageElement(leavingEl)).duration(300);
  enterTransition.addElement(getIonPageElement(enteringEl)).duration(300)
    .fill('both')
    .beforeRemoveClass('ion-page-invisible');


  if (!backDirection) {
    enterContentTransition
      .beforeStyles({ border: 'thin solid black' })
      .keyframes([{ offset: 0, transform: 'translateX(100%)' }, { offset: 1, transform: 'translateX(0%)' }])
      .afterClearStyles(['border']);

    leavingContentTransition.keyframes([
      { offset: 0, transform: 'translateX(0%)' },
      { offset: 1, transform: 'translateX(-100%)' }
    ]);
  } else {
    enterContentTransition
      .beforeStyles({ border: 'thin solid black' })
      .keyframes([{ offset: 0, transform: 'translateX(-100%)' }, { offset: 1, transform: 'translateX(0%)' }])
      .afterClearStyles(['border']);

    leavingContentTransition.keyframes([
      { offset: 0, transform: 'translateX(0%)' },
      { offset: 1, transform: 'translateX(100%)' }
    ]);
  }

  rootTransition.addAnimation([
    enterTransition,
    leavingTransition,
    enterContentTransition,
    leavingContentTransition
  ]);
  if (leavingHeaderToolbarTransition) {
    rootTransition.addAnimation(leavingHeaderToolbarTransition);
  }
  if (enteringHeaderToolbarTransition) {
    rootTransition.addAnimation(enteringHeaderToolbarTransition);
  }
  if (leavingFabIconTransition) {
    rootTransition.addAnimation(leavingFabIconTransition);
  }
  return rootTransition;
};

