/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/icon-tile/icons.ts":
/*!***********************************!*\
  !*** ./blocks/icon-tile/icons.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ICON_OPTIONS: function() { return /* binding */ ICON_OPTIONS; },
/* harmony export */   ICON_PATHS: function() { return /* binding */ ICON_PATHS; },
/* harmony export */   iconSvg: function() { return /* binding */ iconSvg; }
/* harmony export */ });
const ICON_PATHS = {
  search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  'chevron-right': '<polyline points="9 18 15 12 9 6"/>',
  'chevron-left': '<polyline points="15 18 9 12 15 6"/>',
  'chevron-down': '<polyline points="6 9 12 15 18 9"/>',
  close: '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
  rocket: '<path d="M12 2c2.5 2 4 5.5 4 9 0 2-1 3.8-2 5l-2 2-2-2c-1-1.2-2-3-2-5 0-3.5 1.5-7 4-9z"/><circle cx="12" cy="10" r="1.5"/><path d="M8.5 15.5 6 18l1-3.5M15.5 15.5 18 18l-1-3.5"/>',
  'credit-card': '<rect x="2.5" y="5.5" width="19" height="13" rx="2"/><line x1="2.5" y1="10" x2="21.5" y2="10"/>',
  headphones: '<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="2.5" y="13" width="4" height="6" rx="1.5"/><rect x="17.5" y="13" width="4" height="6" rx="1.5"/>',
  ear: '<path d="M8 12a5 5 0 0 1 5-5 5 5 0 0 1 5 5c0 2.5-2 3-2 5.5a2.5 2.5 0 0 1-5 0"/><path d="M8 12c0 3 1.5 4.5 1.5 7"/>',
  compass: '<circle cx="12" cy="12" r="9.5"/><polygon points="15 9 13 13 9 15 11 11 15 9"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 19c0-3.3 3-5.5 6.5-5.5s6.5 2.2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 13.8c2.6.5 4.5 2.4 4.5 5.2"/>',
  mic: '<rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><line x1="12" y1="17.5" x2="12" y2="21.5"/><line x1="8.5" y1="21.5" x2="15.5" y2="21.5"/>',
  'user-star': '<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20.5c0-3.9 3.4-6.5 7.5-6.5 1 0 1.9.15 2.8.43"/><path d="M19 13.8l1 2 2.2.3-1.6 1.5.4 2.2-2-1.05-2 1.05.4-2.2-1.6-1.5 2.2-.3z"/>',
  shield: '<path d="M12 2.5 20 6v6c0 5-3.5 8-8 9.5-4.5-1.5-8-4.5-8-9.5V6z"/><polyline points="9 12 11 14 15 9.5"/>',
  'life-buoy': '<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="4"/><line x1="5.1" y1="5.1" x2="9.2" y2="9.2"/><line x1="14.8" y1="14.8" x2="18.9" y2="18.9"/><line x1="18.9" y1="5.1" x2="14.8" y2="9.2"/><line x1="9.2" y1="14.8" x2="5.1" y2="18.9"/>',
  'question-circle': '<circle cx="12" cy="12" r="9.5"/><path d="M9.5 9.2a2.5 2.5 0 1 1 3.7 2.2c-.9.5-1.2.9-1.2 1.8"/><line x1="12" y1="16.5" x2="12" y2="16.6"/>',
  'check-circle': '<circle cx="12" cy="12" r="9.5"/><polyline points="7.5 12.5 10.5 15.5 16.5 9"/>',
  paperclip: '<path d="M17.5 8.5 9.9 16a3 3 0 1 1-4.2-4.2L14 3.4a2 2 0 0 1 2.8 2.8L8.4 14.6a1 1 0 0 1-1.4-1.4l7-7"/>'
};
const ICON_OPTIONS = Object.keys(ICON_PATHS).map(key => ({
  label: key,
  value: key
}));
function iconSvg(key, size = 24) {
  const path = ICON_PATHS[key] || '';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${path}</svg>`;
}

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ (function(module) {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ (function(module) {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ (function(module) {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ (function(module) {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ (function(module) {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./blocks/cta-banner/block.json":
/*!**************************************!*\
  !*** ./blocks/cta-banner/block.json ***!
  \**************************************/
/***/ (function(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"auclair/cta-banner","title":"CTA Banner","category":"auclair","description":"“Still need help?” panel with icon, body copy, and a CTA button.","textdomain":"auclair","attributes":{"heading":{"type":"string","default":"Still need help?"},"body":{"type":"string","default":"Our support team is available 7 days a week. Raise a ticket and we will follow up asap."},"buttonLabel":{"type":"string","default":"Raise A Ticket"},"buttonUrl":{"type":"string","default":"/help/raise-a-ticket/"},"accent":{"type":"string","default":"#E9CA75"}},"supports":{"html":false,"align":false},"editorScript":"file:./index.tsx","style":"file:./style.css"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
!function() {
/*!*************************************!*\
  !*** ./blocks/cta-banner/index.tsx ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./blocks/cta-banner/block.json");
/* harmony import */ var _icon_tile_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../icon-tile/icons */ "./blocks/icon-tile/icons.ts");
var _jsxFileName = "/Users/stephingasper/Documents/repos/auclair-website/wp-content/themes/auclair-help-center/blocks/cta-banner/index.tsx";

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }







const noop = () => undefined;
const Panel = ({
  heading,
  body,
  buttonLabel,
  buttonUrl,
  accent,
  editable,
  onChangeHeading = noop,
  onChangeBody = noop,
  onChangeButtonLabel = noop
}) => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
  className: "auclair-cta-banner auclair-ring-hover",
  style: {
    '--auclair-ring-accent': accent
  },
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 34,
    columnNumber: 2
  }
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  className: "auclair-icon-tile is-large",
  style: {
    '--auclair-icon-accent': accent
  },
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 38,
    columnNumber: 3
  }
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  className: "auclair-icon-tile__glow",
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 39,
    columnNumber: 4
  }
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  className: "auclair-icon-tile__icon",
  dangerouslySetInnerHTML: {
    __html: (0,_icon_tile_icons__WEBPACK_IMPORTED_MODULE_6__.iconSvg)('question-circle', 28)
  },
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 40,
    columnNumber: 4
  }
})), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
  className: "auclair-cta-banner__body",
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 45,
    columnNumber: 3
  }
}, editable ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
  tagName: "h2",
  className: "auclair-cta-banner__heading",
  value: heading,
  onChange: onChangeHeading,
  allowedFormats: [],
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 48,
    columnNumber: 6
  }
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
  tagName: "p",
  className: "auclair-cta-banner__text",
  value: body,
  onChange: onChangeBody,
  allowedFormats: [],
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 49,
    columnNumber: 6
  }
})) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText.Content, {
  tagName: "h2",
  className: "auclair-cta-banner__heading",
  value: heading,
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 53,
    columnNumber: 6
  }
}), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText.Content, {
  tagName: "p",
  className: "auclair-cta-banner__text",
  value: body,
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 54,
    columnNumber: 6
  }
}))), editable ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
  tagName: "span",
  className: "auclair-button is-primary auclair-cta-banner__button",
  value: buttonLabel,
  onChange: onChangeButtonLabel,
  allowedFormats: [],
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 59,
    columnNumber: 4
  }
}) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText.Content, {
  tagName: "a",
  className: "auclair-button is-primary auclair-cta-banner__button",
  value: buttonLabel
  // @ts-ignore -- href is a valid prop on the rendered anchor tag.
  ,
  href: buttonUrl,
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 67,
    columnNumber: 4
  }
}));
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  edit: ({
    attributes,
    setAttributes
  }) => {
    const heading = attributes.heading;
    const body = attributes.body;
    const buttonLabel = attributes.buttonLabel;
    const buttonUrl = attributes.buttonUrl;
    const accent = attributes.accent;
    const [isEditingLink, setIsEditingLink] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)();
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 90,
        columnNumber: 5
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Settings', 'auclair'),
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 91,
        columnNumber: 6
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 92,
        columnNumber: 7
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Button URL', 'auclair')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
      variant: "secondary",
      onClick: () => setIsEditingLink(true),
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 93,
        columnNumber: 7
      }
    }, buttonUrl || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Add link', 'auclair')), isEditingLink && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Popover, {
      onClose: () => setIsEditingLink(false),
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 97,
        columnNumber: 8
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.LinkControl, {
      value: {
        url: buttonUrl
      },
      onChange: value => setAttributes({
        buttonUrl: value?.url || ''
      }) // eslint-disable-line @typescript-eslint/no-explicit-any
      ,
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 98,
        columnNumber: 9
      }
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 104,
        columnNumber: 7
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Accent colour', 'auclair')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ColorPicker, {
      color: accent,
      onChange: accent => setAttributes({
        accent
      }),
      enableAlpha: false,
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 105,
        columnNumber: 7
      }
    }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", _extends({}, blockProps, {
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 108,
        columnNumber: 5
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Panel, {
      heading: heading,
      body: body,
      buttonLabel: buttonLabel,
      buttonUrl: buttonUrl,
      accent: accent,
      editable: true,
      onChangeHeading: heading => setAttributes({
        heading
      }),
      onChangeBody: body => setAttributes({
        body
      }),
      onChangeButtonLabel: buttonLabel => setAttributes({
        buttonLabel
      }),
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 109,
        columnNumber: 6
      }
    })));
  },
  save: ({
    attributes
  }) => {
    const heading = attributes.heading;
    const body = attributes.body;
    const buttonLabel = attributes.buttonLabel;
    const buttonUrl = attributes.buttonUrl;
    const accent = attributes.accent;
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save();
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", _extends({}, blockProps, {
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 133,
        columnNumber: 4
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Panel, {
      heading: heading,
      body: body,
      buttonLabel: buttonLabel,
      buttonUrl: buttonUrl,
      accent: accent,
      editable: false,
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 134,
        columnNumber: 5
      }
    }));
  }
});
}();
/******/ })()
;
//# sourceMappingURL=index.js.map