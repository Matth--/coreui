/*!
  * CoreUI navigation.js v4.2.3 (https://coreui.io)
  * Copyright 2022 The CoreUI Team (https://github.com/orgs/coreui/people)
  * Licensed under MIT (https://coreui.io)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('./util/index.js'), require('./dom/data.js'), require('./dom/event-handler.js'), require('./dom/manipulator.js'), require('./dom/selector-engine.js'), require('./base-component.js')) :
  typeof define === 'function' && define.amd ? define(['./util/index', './dom/data', './dom/event-handler', './dom/manipulator', './dom/selector-engine', './base-component'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Navigation = factory(global.Index, global.Data, global.EventHandler, global.Manipulator, global.SelectorEngine, global.BaseComponent));
})(this, (function (index_js, Data, EventHandler, Manipulator, SelectorEngine, BaseComponent) { 'use strict';

  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

  const Data__default = /*#__PURE__*/_interopDefaultLegacy(Data);
  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
  const Manipulator__default = /*#__PURE__*/_interopDefaultLegacy(Manipulator);
  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

  /**
   * --------------------------------------------------------------------------
   * CoreUI (v4.2.3): navigation.js
   * Licensed under MIT (https://coreui.io/license)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'navigation';
  const DATA_KEY = 'coreui.navigation';
  const EVENT_KEY = `.${DATA_KEY}`;
  const DATA_API_KEY = '.data-api';
  const Default = {
    activeLinksExact: true,
    groupsAutoCollapse: true
  };
  const DefaultType = {
    activeLinksExact: 'boolean',
    groupsAutoCollapse: '(string|boolean)'
  };
  const CLASS_NAME_ACTIVE = 'active';
  const CLASS_NAME_SHOW = 'show';
  const CLASS_NAME_NAV_GROUP = 'nav-group';
  const CLASS_NAME_NAV_GROUP_TOGGLE = 'nav-group-toggle';
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
  const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
  const SELECTOR_NAV_GROUP = '.nav-group';
  const SELECTOR_NAV_GROUP_ITEMS = '.nav-group-items';
  const SELECTOR_NAV_GROUP_TOGGLE = '.nav-group-toggle';
  const SELECTOR_NAV_LINK = '.nav-link';
  const SELECTOR_DATA_NAVIGATION = '[data-coreui="navigation"]';

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Navigation extends BaseComponent__default.default {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._setActiveLink();
      this._addEventListeners();
      Data__default.default.set(element, DATA_KEY, this);
    }
    // Getters

    static get Default() {
      return Default;
    }
    static get DATA_KEY() {
      return DATA_KEY;
    }
    static get DefaultType() {
      return DefaultType;
    }
    static get NAME() {
      return NAME;
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
    _setActiveLink() {
      for (const element of Array.from(this._element.querySelectorAll(SELECTOR_NAV_LINK))) {
        if (element.classList.contains(CLASS_NAME_NAV_GROUP_TOGGLE)) {
          continue;
        }
        let currentUrl = String(window.location);
        const urlHasParams = /\?.*=/;
        const urlHasQueryString = /\?./;
        const urlHasHash = /#./;
        if (urlHasParams.test(currentUrl) || urlHasQueryString.test(currentUrl)) {
          currentUrl = currentUrl.split('?')[0];
        }
        if (urlHasHash.test(currentUrl)) {
          currentUrl = currentUrl.split('#')[0];
        }
        if (this._config.activeLinksExact && element.href === currentUrl) {
          element.classList.add(CLASS_NAME_ACTIVE);
          // eslint-disable-next-line unicorn/no-array-for-each
          Array.from(this._getParents(element, SELECTOR_NAV_GROUP)).forEach(element => {
            element.classList.add(CLASS_NAME_SHOW);
            element.setAttribute('aria-expanded', true);
          });
        }
        if (!this._config.activeLinksExact && element.href.startsWith(currentUrl)) {
          element.classList.add(CLASS_NAME_ACTIVE);
          // eslint-disable-next-line unicorn/no-array-for-each
          Array.from(this._getParents(element, SELECTOR_NAV_GROUP)).forEach(element => {
            element.classList.add(CLASS_NAME_SHOW);
            element.setAttribute('aria-expanded', true);
          });
        }
      }
    }
    _getParents(element, selector) {
      // Setup parents array
      const parents = [];

      // Get matching parent elements
      for (; element && element !== document; element = element.parentNode) {
        // Add matching parents to array
        if (selector) {
          if (element.matches(selector)) {
            parents.push(element);
          }
        } else {
          parents.push(element);
        }
      }
      return parents;
    }
    _getAllSiblings(element, filter) {
      const siblings = [];
      element = element.parentNode.firstChild;
      do {
        if (element.nodeType === 3) {
          continue; // text node
        }

        if (element.nodeType === 8) {
          continue; // comment node
        }

        if (!filter || filter(element)) {
          siblings.push(element);
        }

        // eslint-disable-next-line no-cond-assign
      } while (element = element.nextSibling);
      return siblings;
    }
    _getChildren(n, skipMe) {
      const children = [];
      for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== skipMe) {
          children.push(n);
        }
      }
      return children;
    }
    _getSiblings(element, filter) {
      const siblings = this._getChildren(element.parentNode.firstChild, element).filter(filter);
      return siblings;
    }
    _slideDown(element) {
      element.style.height = 'auto';
      const height = element.clientHeight;
      element.style.height = '0px';
      setTimeout(() => {
        element.style.height = `${height}px`;
      }, 0);
      this._queueCallback(() => {
        element.style.height = 'auto';
      }, element, true);
    }
    _slideUp(element, callback) {
      const height = element.clientHeight;
      element.style.height = `${height}px`;
      setTimeout(() => {
        element.style.height = '0px';
      }, 0);
      this._queueCallback(() => {
        if (typeof callback === 'function') {
          callback();
        }
      }, element, true);
    }
    _toggleGroupItems(event) {
      let toggler = event.target;
      if (!toggler.classList.contains(CLASS_NAME_NAV_GROUP_TOGGLE)) {
        toggler = toggler.closest(SELECTOR_NAV_GROUP_TOGGLE);
      }
      const filter = element => Boolean(element.classList.contains(CLASS_NAME_NAV_GROUP) && element.classList.contains(CLASS_NAME_SHOW));

      // Close other groups
      if (this._config.groupsAutoCollapse === true) {
        for (const element of this._getSiblings(toggler.parentNode, filter)) {
          this._slideUp(SelectorEngine__default.default.findOne(SELECTOR_NAV_GROUP_ITEMS, element), () => {
            element.classList.remove(CLASS_NAME_SHOW);
            element.setAttribute('aria-expanded', false);
          });
        }
      }
      if (toggler.parentNode.classList.contains(CLASS_NAME_SHOW)) {
        this._slideUp(SelectorEngine__default.default.findOne(SELECTOR_NAV_GROUP_ITEMS, toggler.parentNode), () => {
          toggler.parentNode.classList.remove(CLASS_NAME_SHOW);
          toggler.parentNode.setAttribute('aria-expanded', false);
        });
        return;
      }
      toggler.parentNode.classList.add(CLASS_NAME_SHOW);
      toggler.parentNode.setAttribute('aria-expanded', true);
      this._slideDown(SelectorEngine__default.default.findOne(SELECTOR_NAV_GROUP_ITEMS, toggler.parentNode));
    }
    _addEventListeners() {
      EventHandler__default.default.on(this._element, EVENT_CLICK_DATA_API, SELECTOR_NAV_GROUP_TOGGLE, event => {
        event.preventDefault();
        this._toggleGroupItems(event, this);
      });
    }

    // Static

    static navigationInterface(element, config) {
      const data = Navigation.getOrCreateInstance(element, config);
      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      }
    }
    static jQueryInterface(config) {
      return this.each(function () {
        Navigation.navigationInterface(this, config);
      });
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */
  EventHandler__default.default.on(window, EVENT_LOAD_DATA_API, () => {
    for (const element of Array.from(document.querySelectorAll(SELECTOR_DATA_NAVIGATION))) {
      Navigation.navigationInterface(element);
    }
  });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Navigation to jQuery only if jQuery is present
   */

  index_js.defineJQueryPlugin(Navigation);

  return Navigation;

}));
//# sourceMappingURL=navigation.js.map
