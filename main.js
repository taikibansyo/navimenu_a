document.addEventListener('DOMContentLoaded', function () {
  const menu = new Navimenu( init = {
    btn: '.navi__inner button',
    target: '.circle',
    bgArea: 'body',
    container: '.navi__inner'
  })
})

class Navimenu {
  constructor(init) {
    this._init(init);
    this._addEvent();
  }

  _init(init) {
    this.DOM = {};
    this.DOM.btn = document.querySelectorAll(init.btn);
    this.DOM.target = document.querySelector(init.target);
    this.DOM.bg = document.querySelector(init.bgArea);
    this.DOM.container = document.querySelector(init.container);
    this.prevIndex = 1;
    this.dFlag = null;
    this.lockFlag = null;
    this.circleDiameter = 40;
    this.circleInterval = 5;
    this.eventType = this._getEventType();
  }

  _getEventType() {
    const isTouchCapable =
      'ontouchstart' in window ||
      (window.DocumentTouch && document instanceof window.DocumentTouch) ||
      navigator.maxTouchPoints > 0 ||
      window.navigator.msMaxTouchPoints > 0
    return isTouchCapable ? 'touchstart' : 'click'
  }

  _setStyleWidth(d, i, prev) {
    return (d > 0)
      ? (i - prev) * (this.circleDiameter + this.circleInterval) + this.circleDiameter
      : (prev - i) * (this.circleDiameter + this.circleInterval) + this.circleDiameter
  }

  async _sets(t, n = {}) {
    this.lockFlag = 1;
    const delay = () => {
      setTimeout(() => {
        if (n.right) t.style.right = n.right;
        if (n.left) t.style.left = n.left;
        if (n.containerFlex) this.DOM.container.justifyContent = `flex-${n.flex}`;
        if (n.width)  t.style.width = n.width;
        this.lockFlag = 0;
      }, n.delay)
    };
    const nodelay = () => {
      setTimeout(() => {
        if (n.right) t.style.right = n.right;
        if (n.left) t.style.left = n.left;
        if (n.containerFlex) this.DOM.container.justifyContent = `flex-${n.flex}`;
        if (n.width)  t.style.width = n.width;
    }, 0)
    };
    return (n.delay) ? await delay() : await nodelay();
  }

  _setMoveX(d, i, prev) {
    prev ?　d = -d : d = d ;
    return (d > 0)
      ? (this.DOM.btn.length - i) * (this.circleDiameter + this.circleInterval) + this.circleInterval // 2=140, 3=95, 4=50, 5=5
      : (i - 1) * (this.circleDiameter + this.circleInterval) + this.circleInterval // 1=5, 2=50, 3=95, 4=140
  }

  _toggle(dataIndex) {
    // if (this.lockFlag) return;

    const slider = {}
    this.DOM.target.classList.remove(`bg-color-${this.prevIndex}`),
    this.DOM.target.classList.toggle(`bg-color-${dataIndex}`),
    this.DOM.bg.classList.remove(`bg-color-${this.prevIndex}`),
    this.DOM.bg.classList.toggle(`bg-color-${dataIndex}`);
    slider.direction = dataIndex - this.prevIndex;
    const moveAfter = this._setMoveX(slider.direction, dataIndex),
    moveSwitch = this._setMoveX(slider.direction, this.prevIndex, 'prev'),
    moveWidth = this._setStyleWidth(slider.direction, dataIndex, this.prevIndex);

    const moveIds = new Set();
    if (slider.direction > 0) {
      // 右方向への移動
      if ( this.dFlag ) {
        moveIds.add(this._sets(this.DOM.target, {
          right: `auto`,
          left: `${moveSwitch}px`,
          // containerFlex: `end`
        }));
      }

      moveIds.add(this._sets(this.DOM.target, {
        // containerFlex: `start`,
        width: `${moveWidth}px`
      }));
      
      moveIds.add(this._sets(this.DOM.target, {
        right: `${moveAfter}px`,
        left: `auto`,
        // containerFlex: `end`,
        width: `${this.circleDiameter}px`,
        delay: 160
      }));

      this.dFlag = 1;
    } else {
      // 左方向への移動
      if ( !this.dFlag ) {
        moveIds.add(this._sets(this.DOM.target, {
          right: `${moveSwitch}px`,
          left: `auto`,
          containerFlex: `start`
        }))
      }

      moveIds.add(this._sets(this.DOM.target, {
        width: `${moveWidth}px`
      }));

      moveIds.add(this._sets(this.DOM.target, {
        right: `auto`,
        left: `${moveAfter}px`,
        containerFlex: `start`,
        width: `${this.circleDiameter}px`,
        delay: 160
      }));

      this.dFlag = 0;
    }

    Promise.all(moveIds);

    this.DOM.btn.forEach((e) => {
      e.classList.remove('inview')
    })
    this.DOM.btn[dataIndex - 1].classList.add('inview');
    this.prevIndex = dataIndex;
  }

  _addEvent() {
    this.DOM.btn.forEach((e) => {
      const dataIndex = parseInt(e.getAttribute('data-index')) + 1;
      e.addEventListener(
        this.eventType,
        this._toggle.bind(this, dataIndex.toString())
      )
    })
  }
}
