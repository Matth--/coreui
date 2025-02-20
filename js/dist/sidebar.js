/*!
  * CoreUI sidebar.js v4.2.3 (https://coreui.io)
  * Copyright 2022 The CoreUI Team (https://github.com/orgs/coreui/people)
  * Licensed under MIT (https://coreui.io)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('./util/index.js'), require('./util/scrollbar.js'), require('./dom/event-handler.js'), require('./base-component.js'), require('./dom/manipulator.js'), require('./util/backdrop.js')) :
  typeof define === 'function' && define.amd ? define(['./util/index', './util/scrollbar', './dom/event-handler', './base-component', './dom/manipulator', './util/backdrop'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Sidebar = factory(global.Index, global.Scrollbar, global.EventHandler, global.BaseComponent, global.Manipulator, global.Backdrop));
})(this, (function (index_js, ScrollBarHelper, EventHandler, BaseComponent, Manipulator, Backdrop) { 'use strict';

  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

  const ScrollBarHelper__default = /*#__PURE__*/_interopDefaultLegacy(ScrollBarHelper);
  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);
  const Manipulator__default = /*#__PURE__*/_interopDefaultLegacy(Manipulator);
  const Backdrop__default = /*#__PURE__*/_interopDefaultLegacy(Backdrop);

  /**
   * --------------------------------------------------------------------------
   * CoreUI (v4.2.3): sidebar.js
   * Licensed under MIT (https://coreui.io/license)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'sidebar';
  const DATA_KEY = 'coreui.sidebar';
  const EVENT_KEY = `.${DATA_KEY}`;
  const DATA_API_KEY = '.data-api';
  const Default = {};
  const DefaultType = {};
  const CLASS_NAME_BACKDROP = 'sidebar-backdrop';
  const CLASS_NAME_HIDE = 'hide';
  const CLASS_NAME_SHOW = 'show';
  const CLASS_NAME_SIDEBAR_NARROW = 'sidebar-narrow';
  const CLASS_NAME_SIDEBAR_OVERLAID = 'sidebar-overlaid';
  const CLASS_NAME_SIDEBAR_NARROW_UNFOLDABLE = 'sidebar-narrow-unfoldable';
  const EVENT_HIDE = `hide${EVENT_KEY}`;
  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
  const EVENT_RESIZE = 'resize';
  const EVENT_SHOW = `show${EVENT_KEY}`;
  const EVENT_SHOWN = `shown${EVENT_KEY}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
  const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
  const SELECTOR_DATA_CLOSE = '[data-coreui-close="sidebar"]';
  const SELECTOR_DATA_TOGGLE = '[data-coreui-toggle]';
  const SELECTOR_SIDEBAR = '.sidebar';

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Sidebar extends BaseComponent__default.default {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._show = this._isVisible();
      this._mobile = this._isMobile();
      this._overlaid = this._isOverlaid();
      this._narrow = this._isNarrow();
      this._unfoldable = this._isUnfoldable();
      this._backdrop = this._initializeBackDrop();
      this._addEventListeners();
    }

    // Getters

    static get Default() {
      return Default;
    }
    static get DefaultType() {
      return DefaultType;
    }
    static get NAME() {
      return NAME;
    }

    // Public

    show() {
      EventHandler__default.default.trigger(this._element, EVENT_SHOW);
      if (this._element.classList.contains(CLASS_NAME_HIDE)) {
        this._element.classList.remove(CLASS_NAME_HIDE);
      }
      if (this._isMobile()) {
        this._element.classList.add(CLASS_NAME_SHOW);
        this._backdrop.show();
        new ScrollBarHelper__default.default().hide();
      }
      const complete = () => {
        if (this._isVisible() === true) {
          this._show = true;
          if (this._isMobile() || this._isOverlaid()) {
            this._addClickOutListener();
          }
          EventHandler__default.default.trigger(this._element, EVENT_SHOWN);
        }
      };
      this._queueCallback(complete, this._element, true);
    }
    hide() {
      EventHandler__default.default.trigger(this._element, EVENT_HIDE);
      if (this._element.classList.contains(CLASS_NAME_SHOW)) {
        this._element.classList.remove(CLASS_NAME_SHOW);
      }
      if (this._isMobile()) {
        this._backdrop.hide();
        new ScrollBarHelper__default.default().reset();
      } else {
        this._element.classList.add(CLASS_NAME_HIDE);
      }
      const complete = () => {
        if (this._isVisible() === false) {
          this._show = false;
          if (this._isMobile() || this._isOverlaid()) {
            this._removeClickOutListener();
          }
          EventHandler__default.default.trigger(this._element, EVENT_HIDDEN);
        }
      };
      this._queueCallback(complete, this._element, true);
    }
    toggle() {
      if (this._isVisible()) {
        this.hide();
        return;
      }
      this.show();
    }
    narrow() {
      if (!this._isMobile()) {
        this._addClassName(CLASS_NAME_SIDEBAR_NARROW);
        this._narrow = true;
      }
    }
    unfoldable() {
      if (!this._isMobile()) {
        this._addClassName(CLASS_NAME_SIDEBAR_NARROW_UNFOLDABLE);
        this._unfoldable = true;
      }
    }
    reset() {
      if (!this._isMobile()) {
        if (this._narrow) {
          this._element.classList.remove(CLASS_NAME_SIDEBAR_NARROW);
          this._narrow = false;
        }
        if (this._unfoldable) {
          this._element.classList.remove(CLASS_NAME_SIDEBAR_NARROW_UNFOLDABLE);
          this._unfoldable = false;
        }
      }
    }
    toggleNarrow() {
      if (this._narrow) {
        this.reset();
        return;
      }
      this.narrow();
    }
    toggleUnfoldable() {
      if (this._unfoldable) {
        this.reset();
        return;
      }
      this.unfoldable();
    }

    // Private

    _getConfig(config) {
      config = {
        ...Default,
        ...Manipulator__default.default.getDataAttributes(this._element),
        ...(typeof config === 'object' ? config : {})
      };
      return config;
    }
    _initializeBackDrop() {
      return new Backdrop__default.default({
        className: CLASS_NAME_BACKDROP,
        isVisible: this._isMobile(),
        isAnimated: true,
        rootElement: this._element.parentNode,
        clickCallback: () => this.hide()
      });
    }
    _isMobile() {
      return Boolean(window.getComputedStyle(this._element, null).getPropertyValue('--cui-is-mobile'));
    }
    _isNarrow() {
      return this._element.classList.contains(CLASS_NAME_SIDEBAR_NARROW);
    }
    _isOverlaid() {
      return this._element.classList.contains(CLASS_NAME_SIDEBAR_OVERLAID);
    }
    _isUnfoldable() {
      return this._element.classList.contains(CLASS_NAME_SIDEBAR_NARROW_UNFOLDABLE);
    }
    _isVisible() {
      const rect = this._element.getBoundingClientRect();
      return rect.top >= 0 && rect.left >= 0 && Math.floor(rect.bottom) <= (window.innerHeight || document.documentElement.clientHeight) && Math.floor(rect.right) <= (window.innerWidth || document.documentElement.clientWidth);
    }
    _addClassName(className) {
      this._element.classList.add(className);
    }
    _clickOutListener(event, sidebar) {
      if (event.target.closest(SELECTOR_SIDEBAR) === null) {
        event.preventDefault();
        event.stopPropagation();
        sidebar.hide();
      }
    }
    _addClickOutListener() {
      EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, event => {
        this._clickOutListener(event, this);
      });
    }
    _removeClickOutListener() {
      EventHandler__default.default.off(document, EVENT_CLICK_DATA_API);
    }

    // Sidebar navigation
    _addEventListeners() {
      if (this._mobile && this._show) {
        this._addClickOutListener();
      }
      if (this._overlaid && this._show) {
        this._addClickOutListener();
      }
      EventHandler__default.default.on(this._element, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, event => {
        event.preventDefault();
        const toggle = Manipulator__default.default.getDataAttribute(event.target, 'toggle');
        if (toggle === 'narrow') {
          this.toggleNarrow();
        }
        if (toggle === 'unfoldable') {
          this.toggleUnfoldable();
        }
      });
      EventHandler__default.default.on(this._element, EVENT_CLICK_DATA_API, SELECTOR_DATA_CLOSE, event => {
        event.preventDefault();
        this.hide();
      });
      EventHandler__default.default.on(window, EVENT_RESIZE, () => {
        if (this._isMobile() && this._isVisible()) {
          this.hide();
          this._backdrop = this._initializeBackDrop();
        }
      });
    }

    // Static

    static sidebarInterface(element, config) {
      const data = Sidebar.getOrCreateInstance(element, config);
      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      }
    }
    static jQueryInterface(config) {
      return this.each(function () {
        Sidebar.sidebarInterface(this, config);
      });
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  EventHandler__default.default.on(window, EVENT_LOAD_DATA_API, () => {
    for (const element of Array.from(document.querySelectorAll(SELECTOR_SIDEBAR))) {
      Sidebar.sidebarInterface(element);
    }
  });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  index_js.defineJQueryPlugin(Sidebar);

  return Sidebar;

}));
//# sourceMappingURL=sidebar.js.map
