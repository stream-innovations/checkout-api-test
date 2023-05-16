"use strict";
(() => {
var exports = {};
exports.id = 950;
exports.ids = [950];
exports.modules = {

/***/ 924:
/***/ ((module) => {

module.exports = import("axios");;

/***/ }),

/***/ 477:
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ 619:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var _lib_oauth2client_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(914);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_oauth2client_client__WEBPACK_IMPORTED_MODULE_0__]);
_lib_oauth2client_client__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).send({
            error: "Only POST requests allowed"
        });
        return;
    }
    const client = new _lib_oauth2client_client__WEBPACK_IMPORTED_MODULE_0__/* .OAuth2Client */ .l({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        accessTokenUrl: process.env.OAUTH2_ACCESS_TOKEN_URL,
        refreshTokenUrl: process.env.OAUTH2_REFRESH_TOKEN_URL
    });
    const reqData = {
        in_currency: req.body.inCurrency,
        out_currency: req.body.outCurrency,
        amount: req.body.amount,
        swap_mode: "ExactOut"
    };
    const result = await client.post(process.env.EXCHANGE_RATE_URL, reqData);
    console.log(result);
    res.status(200).json({
        inAmount: result.data.exchange_rate.inAmount,
        outAmount: result.data.exchange_rate.outAmount
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [914], () => (__webpack_exec__(619)));
module.exports = __webpack_exports__;

})();