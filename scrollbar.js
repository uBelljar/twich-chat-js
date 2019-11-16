'use strict'

class AddScrollBar {
  constructor(element) {
    this._element = element;
    this._isTaken = false;
    this._mouseY = 0;
    this._scrollbarTop = 0
    this.addScroll();
  }

  addScroll() {
    let scrollbar = document.createElement('div');
    this._scrollbar = scrollbar;
    scrollbar.classList = 'scrollbar';
    this._element.appendChild(scrollbar);

    let scrollbarHeight = scrollbar.getBoundingClientRect().height;
    let vPortPercent = this._element.scrollTop / (this._element.scrollHeight - this._element.clientHeight);
    this._scrollbarTop = (this._element.clientHeight - scrollbarHeight) * vPortPercent;
    scrollbar.style.top = this._element.scrollTop + this._scrollbarTop +'px';

    this._element.addEventListener('scroll', () => {
      vPortPercent = this._element.scrollTop / (this._element.scrollHeight - this._element.clientHeight);
      this._scrollbarTop = (this._element.clientHeight - scrollbarHeight) * vPortPercent;
      scrollbar.style.top = this._element.scrollTop + this._scrollbarTop +'px';
    });

    scrollbar.onmousedown = (e) => {
      this._isTaken = true;
      this._mouseY = e.clientY;
    };

    window.addEventListener('mouseup', (e) => {
      this._isTaken = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (this._isTaken) {
        let mDeltaY = e.clientY - this._mouseY;
        this._mouseY = e.clientY;
        this._scrollbarTop += mDeltaY;

        if (this._scrollbarTop < 0) this._scrollbarTop = 0;
        if (this._scrollbarTop > this._element.clientHeight - scrollbarHeight) this._scrollbarTop = this._element.clientHeight - scrollbarHeight;

        scrollbar.style.top = this._element.scrollTop + this._scrollbarTop + 'px';

        let scrollbarPercent = this._scrollbarTop / (this._element.clientHeight - scrollbarHeight);
        this._element.scrollTop = Math.round((this._element.scrollHeight - this._element.clientHeight) * scrollbarPercent);
        console.log();
      }
    });
    //this._element.onscroll = () => console.log('ONCHANGE');
  }
}
