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
/*!***************************************!*\
  !*** ./blocks/search-results/view.ts ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;
let debounceTimer;
let requestId = 0;
function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value;
  return div.innerHTML;
}

// Mirrors render.php's three states exactly, so a result fetched via REST
// renders identically to the server-rendered first paint.
function renderResults(query, results) {
  if ('' === query) {
    return '';
  }
  if (results.length === 0) {
    return `
			<div class="auclair-search-results__empty">
				<p class="auclair-search-results__empty-title">No results for &quot;${escapeHtml(query)}&quot;</p>
				<p class="auclair-search-results__empty-text">Try a different word, or raise a ticket and our team will get back to you.</p>
			</div>
		`;
  }
  const chevron = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><polyline points="9 18 15 12 9 6"/></svg>';
  const rows = results.map((result, index) => {
    const title = escapeHtml(result.title.rendered);
    const divider = index < results.length - 1 ? '<div class="auclair-search-results__divider"></div>' : '';
    return `
				<div class="auclair-search-results__row">
					<a class="auclair-search-results__item" href="${escapeHtml(result.link)}">
						<span>${title}</span>
						${chevron}
					</a>
					${divider}
				</div>
			`;
  }).join('');
  return `<div class="auclair-search-results__list">${rows}</div>`;
}

// The whole point of the homepage search bar jumping here on the first
// keystroke is a seamless continuation — so the input must already have
// focus (cursor after any prefilled query, not at the start) the instant
// this page appears, not just after a click. `autofocus` on the element
// covers most cases; this is the reliable fallback for when the browser
// doesn't honor it (e.g. it's suppressed on some programmatic navigations).
function focusInput() {
  const input = document.querySelector('.auclair-search-results__input');
  if (!input) {
    return;
  }
  input.focus();
  const end = input.value.length;
  input.setSelectionRange(end, end);
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', focusInput);
} else {
  focusInput();
}
(0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('auclair', {
  actions: {
    onQueryInput() {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      const value = ref.value;
      context.query = value;
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Clearing the query back out is the reverse of how a visitor got
      // here in the first place (typing the first letter on the
      // homepage jumps straight here) — so deleting the last character
      // takes them straight back.
      if ('' === value.trim()) {
        window.location.href = context.homeUrl;
        return;
      }

      // Reflect the query in the URL (shareable/bookmarkable, and
      // survives a refresh) without a navigation or page reload.
      const url = new URL(window.location.href);
      url.searchParams.set('q', value);
      window.history.replaceState({}, '', url.toString());
      const container = ref.closest('.auclair-search-results');
      const resultsEl = container?.querySelector('.auclair-search-results__results');
      if (value.trim().length < MIN_QUERY_LENGTH) {
        // Below the minimum for a fetch, but not empty (e.g. one
        // character left after backspacing) — clear stale results
        // from the previous, longer query rather than leave them
        // misleadingly on screen.
        if (resultsEl) {
          resultsEl.innerHTML = '';
        }
        return;
      }
      debounceTimer = setTimeout(() => {
        void fetchResults(value, context.endpoint, context.limit, resultsEl);
      }, DEBOUNCE_MS);
    },
    clearSearch(event) {
      event.preventDefault();
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      const root = ref.closest('.auclair-search-results');
      const input = root?.querySelector('.auclair-search-results__input');
      if (!input) {
        return;
      }
      input.value = '';
      input.dispatchEvent(new Event('input', {
        bubbles: true
      }));
      input.focus();
    }
  }
});
async function fetchResults(query, endpoint, limit, resultsEl) {
  const thisRequestId = ++requestId;
  try {
    const response = await window.fetch(`${endpoint}?search=${encodeURIComponent(query)}&per_page=${limit}&_fields=title,link`);

    // A newer keystroke already started a fetch — this response is stale.
    if (thisRequestId !== requestId || !response.ok || !resultsEl) {
      return;
    }
    const results = await response.json();
    resultsEl.innerHTML = renderResults(query, results);
  } catch (error) {
    if (thisRequestId === requestId && resultsEl) {
      resultsEl.innerHTML = '';
    }
  }
}
})();


//# sourceMappingURL=view.js.map