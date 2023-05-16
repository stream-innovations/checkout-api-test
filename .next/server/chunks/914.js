"use strict";
exports.id = 914;
exports.ids = [914];
exports.modules = {

/***/ 914:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "l": () => (/* binding */ OAuth2Client)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(924);
/* harmony import */ var querystring__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(477);
/* harmony import */ var querystring__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(querystring__WEBPACK_IMPORTED_MODULE_1__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__]);
axios__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


class OAuth2Client {
    constructor(options){
        this.clientId = options.clientId;
        this.clientSecret = options.clientSecret;
        this.accessTokenUrl = options.accessTokenUrl;
        this.refreshTokenUrl = options.refreshTokenUrl;
        this.accessToken = null;
        this.accessTokenExpiryTime = 0;
        this.refreshToken = null;
    }
    async requestAccessToken() {
        const response = await axios__WEBPACK_IMPORTED_MODULE_0__["default"].post(this.accessTokenUrl, querystring__WEBPACK_IMPORTED_MODULE_1___default().stringify({
            grant_type: "client_credentials",
            client_id: this.clientId,
            client_secret: this.clientSecret
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        this.accessToken = response.data.access_token;
        this.accessTokenExpiryTime = Date.now() + response.data.expires_in * 1000;
        this.refreshToken = response.data.refresh_token || null;
    }
    async refreshAccessToken() {
        if (!this.refreshToken) {
            throw new Error("No refresh token available");
        }
        const response = await axios__WEBPACK_IMPORTED_MODULE_0__["default"].post(this.refreshTokenUrl, querystring__WEBPACK_IMPORTED_MODULE_1___default().stringify({
            grant_type: "refresh_token",
            refresh_token: this.refreshToken,
            client_id: this.clientId,
            client_secret: this.clientSecret
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        this.accessToken = response.data.access_token;
        this.accessTokenExpiryTime = Date.now() + response.data.expires_in * 1000;
        this.refreshToken = response.data.refresh_token || null;
    }
    async getAccessToken() {
        if (this.accessToken && Date.now() < this.accessTokenExpiryTime) {
            return this.accessToken;
        }
        try {
            if (!this.refreshToken) {
                await this.requestAccessToken();
            } else {
                await this.refreshAccessToken();
            }
            return this.accessToken;
        } catch (error) {
            this.accessToken = null;
            this.accessTokenExpiryTime = 0;
            this.refreshToken = null;
            throw error;
        }
    }
    async get(url, config) {
        const token = await this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${token}`
        };
        return axios__WEBPACK_IMPORTED_MODULE_0__["default"].get(url, {
            ...config,
            headers
        }).then((response)=>response.data);
    }
    async post(url, data, config) {
        const token = await this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${token}`
        };
        return axios__WEBPACK_IMPORTED_MODULE_0__["default"].post(url, data, {
            ...config,
            headers
        }).then((response)=>response.data);
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;