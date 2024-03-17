import { Animation, createAnimation } from '@ionic/core';

export const openDrawerAnimation = (baseEl: HTMLElement): Animation => {
  const root = baseEl.shadowRoot;

  const wrapperAnimation = createAnimation()
    .addElement(root!.querySelector('.modal-wrapper')!)
    .keyframes([
      { offset: 0, opacity: '1', transform: 'translateX(100%)' },
      { offset: 1, opacity: '1', transform: 'translateX(0)' }
    ]);

  return createAnimation()
    .addElement(baseEl)
    .easing('ease-out')
    .duration(500)
    .addAnimation([wrapperAnimation]);
};

export const closeDrawerAnimation = (baseEl: HTMLElement): Animation => {
  return openDrawerAnimation(baseEl).direction('reverse');
};
