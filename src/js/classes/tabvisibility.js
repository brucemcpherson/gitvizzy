/**
 * handles tab visibility changes
 */

export default class TabVisibility {
  constructor() {
    this._variants = [
      {
        prop: "hidden",
        eventName: "visibilitychange",
      },
      {
        prop: "msHidden",
        eventName: "msvisibilitychange",
      },
      {
        prop: "webkitHidden",
        eventName: "webkitvisibilitychange",
      },
    ];
    this._onVisible = null;
    this._onHidden = null;
    if (!this.isSupported) {
      throw new Error("cant handle visibility change events");
    }
    document.addEventListener(
      this.variant.eventName,
      (e) => this._onChange(e),
      false
    );
  }

  _isdef(variant) {
    return variant ? typeof document[variant.prop] !== typeof undefined : false;
  }

  get variant() {
    return this._variants.find((f) => this._isdef(f));
  }

  get isSupported() {
    return Boolean(this.variant);
  }

  isVisible() {
    return this.isSupported ? !document[this.variant.prop] : true;
  }

  _onChange(e) {
    if (this.isVisible() && this._onVisible) {
      this._onVisible(e);
    } else if (this._onHidden) {
      this._onHidden(e);
    }
  }

  onVisibility(state, func) {
    if (state) {
      this._onVisible = func;
    } else {
      this._onHidden = func;
    }
    return this;
  }

  onVisible(func) {
    return this.onVisibility(true, func);
  }

  onHidden(func) {
    return this.onVisibility(false, func);
  }
}

