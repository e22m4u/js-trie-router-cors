"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var index_exports = {};
__export(index_exports, {
  TrieRouterCors: () => TrieRouterCors
});
module.exports = __toCommonJS(index_exports);

// src/utils/is-promise.js
function isPromise(value) {
  if (!value) {
    return false;
  }
  if (typeof value !== "object") {
    return false;
  }
  return typeof value.then === "function";
}
__name(isPromise, "isPromise");

// src/trie-router-cors.js
var import_js_format = require("@e22m4u/js-format");
var import_js_service = require("@e22m4u/js-service");
var import_js_trie_router = require("@e22m4u/js-trie-router");
var DEFAULT_CORS_ALLOWED_METHODS = "GET, HEAD, PUT, PATCH, POST, DELETE";
var TrieRouterCors = class extends import_js_service.Service {
  static {
    __name(this, "TrieRouterCors");
  }
  /**
   * Options.
   */
  _options = {
    origin: false,
    methods: DEFAULT_CORS_ALLOWED_METHODS,
    allowedHeaders: void 0,
    exposedHeaders: void 0,
    credentials: false,
    maxAge: void 0
  };
  /**
   * Constructor.
   *
   * @param {import('@e22m4u/js-service').ServiceContainer|import('./trie-router-cors.js').TrieRouterCorsOptions} [containerOrOptions]
   * @param {import('./trie-router-cors.js').TrieRouterCorsOptions} [options]
   */
  constructor(containerOrOptions, options) {
    if ((0, import_js_service.isServiceContainer)(containerOrOptions)) {
      super(containerOrOptions);
    } else if (containerOrOptions !== void 0) {
      if (!containerOrOptions || typeof containerOrOptions !== "object" || Array.isArray(containerOrOptions)) {
        throw new import_js_format.InvalidArgumentError(
          "First parameter must be an Object or an instance of ServiceContainer, but %v was given.",
          containerOrOptions
        );
      }
      super();
      options = containerOrOptions;
    } else {
      super();
    }
    if (options !== void 0) {
      if (!options || typeof options !== "object" || Array.isArray(options)) {
        throw new import_js_format.InvalidArgumentError(
          'Parameter "options" must be an Object, but %v was given.',
          options
        );
      }
      if (options.origin !== void 0) {
        if (options.origin === "" || typeof options.origin !== "boolean" && typeof options.origin !== "string" && typeof options.origin !== "function" && !Array.isArray(options.origin) && !(options.origin instanceof RegExp)) {
          throw new import_js_format.InvalidArgumentError(
            'Option "origin" must be a Boolean, a non-empty String, an Array, a Function or an instance of RegExp, but %v was given.',
            options.origin
          );
        }
        if (Array.isArray(options.origin)) {
          options.origin.forEach((el, index) => {
            if ((el === "" || typeof el !== "string") && !(el instanceof RegExp)) {
              throw new import_js_format.InvalidArgumentError(
                'Element %d of the option "origin" must be a non-empty String or an instance of RegExp, but %v was given.',
                index,
                el
              );
            }
          });
        }
      }
      if (options.methods !== void 0) {
        if (options.methods === "" || typeof options.methods !== "string" && !Array.isArray(options.methods)) {
          throw new import_js_format.InvalidArgumentError(
            'Option "methods" must be a non-empty String or an Array, but %v was given.',
            options.methods
          );
        }
        if (Array.isArray(options.methods)) {
          options.methods.forEach((el, index) => {
            if (!el || typeof el !== "string") {
              throw new import_js_format.InvalidArgumentError(
                'Element %d of the option "methods" must be a non-empty String, but %v was given.',
                index,
                el
              );
            }
          });
        }
      }
      if (options.allowedHeaders !== void 0) {
        if (options.allowedHeaders === "" || typeof options.allowedHeaders !== "string" && !Array.isArray(options.allowedHeaders)) {
          throw new import_js_format.InvalidArgumentError(
            'Option "allowedHeaders" must be a non-empty String or an Array, but %v was given.',
            options.allowedHeaders
          );
        }
        if (Array.isArray(options.allowedHeaders)) {
          options.allowedHeaders.forEach((el, index) => {
            if (!el || typeof el !== "string") {
              throw new import_js_format.InvalidArgumentError(
                'Element %d of the option "allowedHeaders" must be a non-empty String, but %v was given.',
                index,
                el
              );
            }
          });
        }
      }
      if (options.exposedHeaders !== void 0) {
        if (options.exposedHeaders === "" || typeof options.exposedHeaders !== "string" && !Array.isArray(options.exposedHeaders)) {
          throw new import_js_format.InvalidArgumentError(
            'Option "exposedHeaders" must be a non-empty String or an Array, but %v was given.',
            options.exposedHeaders
          );
        }
        if (Array.isArray(options.exposedHeaders)) {
          options.exposedHeaders.forEach((el, index) => {
            if (!el || typeof el !== "string") {
              throw new import_js_format.InvalidArgumentError(
                'Element %d of the option "exposedHeaders" must be a non-empty String, but %v was given.',
                index,
                el
              );
            }
          });
        }
      }
      if (options.credentials !== void 0 && typeof options.credentials !== "boolean") {
        throw new import_js_format.InvalidArgumentError(
          'Option "credentials" must be a Boolean, but %v was given.',
          options.credentials
        );
      }
      if (options.maxAge !== void 0) {
        if (typeof options.maxAge !== "number" || !(options.maxAge > 0)) {
          throw new import_js_format.InvalidArgumentError(
            'Option "maxAge" must be a positive Number, but %v was given.',
            options.maxAge
          );
        }
      }
      this._options = { ...this._options, ...options };
    }
    const hookRegistry = this.getService(import_js_trie_router.RouterHookRegistry);
    if (!hookRegistry.hasHook(import_js_trie_router.RouterHookType.ON_REQUEST, onRequestCorsHandler)) {
      hookRegistry.addHook(import_js_trie_router.RouterHookType.ON_REQUEST, onRequestCorsHandler);
    }
  }
  /**
   * Проверка допуска Origin.
   *
   * @param {string|undefined} requestOrigin
   * @returns {boolean|Promise<boolean>}
   */
  _isOriginAllowed(requestOrigin) {
    if (typeof requestOrigin !== "string") {
      throw new import_js_format.InvalidArgumentError(
        'Parameter "requestOrigin" must be a String, but %v was given.',
        requestOrigin
      );
    }
    const origin = this._options.origin;
    if (origin === false) {
      return false;
    }
    if (origin === true || origin === "*") {
      return true;
    }
    if (typeof origin === "string") {
      const allowedOrigins = origin.split(",").map((o) => o.trim().toLowerCase());
      return allowedOrigins.includes(requestOrigin.toLowerCase());
    }
    if (origin instanceof RegExp) {
      return origin.test(requestOrigin);
    }
    if (Array.isArray(origin)) {
      return origin.some((rule) => {
        if (typeof rule === "string") {
          return rule === requestOrigin;
        }
        if (rule instanceof RegExp) {
          return rule.test(requestOrigin);
        }
        return false;
      });
    }
    if (typeof origin === "function") {
      return origin(requestOrigin, this.container);
    }
    return false;
  }
  /**
   * Применение заголовков ответа.
   *
   * @param {import('http').IncomingMessage} req
   * @param {import('http').ServerResponse} res
   * @param {string} requestOrigin
   * @param {boolean} isOriginAllowed
   * @returns {true|undefined}
   */
  _applyCorsHeaders(req, res, requestOrigin, isOriginAllowed) {
    if (!isOriginAllowed) {
      return;
    }
    const options = this["_options"];
    if (options.origin === "*" && !options.credentials) {
      res.setHeader("Access-Control-Allow-Origin", "*");
    } else {
      if (requestOrigin) {
        res.setHeader("Access-Control-Allow-Origin", requestOrigin);
        appendVaryHeader(res, "Origin");
      }
    }
    if (options.credentials === true) {
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    if (req.method !== import_js_trie_router.HttpMethod.OPTIONS) {
      if (options.exposedHeaders) {
        res.setHeader(
          "Access-Control-Expose-Headers",
          Array.isArray(options.exposedHeaders) ? options.exposedHeaders.join(", ") : options.exposedHeaders
        );
      }
      return;
    }
    if (options.methods !== void 0) {
      res.setHeader(
        "Access-Control-Allow-Methods",
        Array.isArray(options.methods) ? options.methods.join(", ") : options.methods
      );
    }
    if (options.allowedHeaders !== void 0) {
      res.setHeader(
        "Access-Control-Allow-Headers",
        Array.isArray(options.allowedHeaders) ? options.allowedHeaders.join(", ") : options.allowedHeaders
      );
    } else if (req.headers["access-control-request-headers"]) {
      res.setHeader(
        "Access-Control-Allow-Headers",
        req.headers["access-control-request-headers"]
      );
      appendVaryHeader(res, "Access-Control-Request-Headers");
    }
    if (options.maxAge !== void 0) {
      res.setHeader("Access-Control-Max-Age", String(options.maxAge));
    }
    res.statusCode = 204;
    res.end();
    return true;
  }
};
function onRequestCorsHandler(req, res, container) {
  const inst = container.getRegistered(TrieRouterCors);
  const options = inst["_options"];
  const requestOrigin = req.headers.origin || "";
  if (!requestOrigin && options.origin !== "*") {
    return;
  }
  const isAllowedOrPromise = inst._isOriginAllowed(requestOrigin);
  if (isPromise(isAllowedOrPromise)) {
    return isAllowedOrPromise.then((isOriginAllowed) => {
      return inst._applyCorsHeaders(req, res, requestOrigin, isOriginAllowed);
    });
  }
  return inst._applyCorsHeaders(req, res, requestOrigin, isAllowedOrPromise);
}
__name(onRequestCorsHandler, "onRequestCorsHandler");
function appendVaryHeader(res, newHeader) {
  const currentVary = res.getHeader("Vary");
  if (!currentVary) {
    res.setHeader("Vary", newHeader);
    return;
  }
  const varyStr = Array.isArray(currentVary) ? currentVary.join(", ") : String(currentVary);
  const regex = new RegExp(`(?:^|,)\\s*${newHeader}\\s*(?:,|$)`, "i");
  if (regex.test(varyStr)) {
    return;
  }
  if (Array.isArray(currentVary)) {
    res.setHeader("Vary", [...currentVary, newHeader]);
  } else {
    res.setHeader("Vary", varyStr + ", " + newHeader);
  }
}
__name(appendVaryHeader, "appendVaryHeader");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TrieRouterCors
});
