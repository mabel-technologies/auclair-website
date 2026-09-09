import * as __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ var __webpack_modules__ = ({

/***/ "@wordpress/interactivity"
/*!*******************************************!*\
  !*** external "@wordpress/interactivity" ***!
  \*******************************************/
(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__;

/***/ }

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	if (!(moduleId in __webpack_modules__)) {
/******/ 		delete __webpack_module_cache__[moduleId];
/******/ 		var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 		e.code = 'MODULE_NOT_FOUND';
/******/ 		throw e;
/******/ 	}
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*****************************************!*\
  !*** ./blocks/article-feedback/view.ts ***!
  \*****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");

const THANKS_VISIBLE_MS = 4000;
(0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('auclair', {
  actions: {
    *castVote() {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      const value = ref?.getAttribute('data-vote-value');
      if ('up' !== value && 'down' !== value) {
        return;
      }

      // Re-clicking the already-selected choice is a no-op — nothing
      // changed, so skip the round trip. Clicking the *other* button is
      // always allowed, even after a previous vote, so a visitor can
      // change their mind.
      if (context.submitting || context.currentVote === value) {
        return;
      }
      context.submitting = true;
      context.error = '';
      try {
        const response = yield window.fetch(context.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': context.nonce
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            id: context.postId,
            value
          })
        });
        if (!response.ok) {
          throw new Error();
        }
        context.currentVote = value;
        context.votedUp = 'up' === value;
        context.votedDown = 'down' === value;
        context.thanksMessage = 'up' === value ? context.thanksUp : context.thanksDown;
        context.showThanks = true;
        setTimeout(() => {
          context.showThanks = false;
        }, THANKS_VISIBLE_MS);
      } catch (error) {
        context.error = 'Something went wrong. Please try again.';
      } finally {
        context.submitting = false;
      }
    }
  }
});
})();


//# sourceMappingURL=view.js.map