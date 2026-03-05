import {isPromise} from './utils/index.js';
import {InvalidArgumentError} from '@e22m4u/js-format';
import {isServiceContainer, Service} from '@e22m4u/js-service';

import {
  HttpMethod,
  RouterHookType,
  RouterHookRegistry,
} from '@e22m4u/js-trie-router';

/**
 * Default cors allowed method.
 */
export const DEFAULT_CORS_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

/**
 * Trie router cors.
 */
export class TrieRouterCors extends Service {
  /**
   * Options.
   */
  _options = {
    origin: false,
    methods: DEFAULT_CORS_ALLOWED_METHODS,
    allowedHeaders: undefined,
    exposedHeaders: undefined,
    credentials: false,
    maxAge: undefined,
  };

  /**
   * Constructor.
   *
   * @param {import('@e22m4u/js-service').ServiceContainer|import('./trie-router-cors.js').TrieRouterCorsOptions} [containerOrOptions]
   * @param {import('./trie-router-cors.js').TrieRouterCorsOptions} [options]
   */
  constructor(containerOrOptions, options) {
    // первый аргумент является контейнером,
    // который передается в базовый конструктор
    if (isServiceContainer(containerOrOptions)) {
      super(containerOrOptions);
    }
    // если первый аргумент не является контейнером,
    // то значение воспринимается как объект настроек
    else if (containerOrOptions !== undefined) {
      if (
        !containerOrOptions ||
        typeof containerOrOptions !== 'object' ||
        Array.isArray(containerOrOptions)
      ) {
        throw new InvalidArgumentError(
          'First parameter must be an Object ' +
            'or an instance of ServiceContainer, ' +
            'but %v was given.',
          containerOrOptions,
        );
      }
      super();
      options = containerOrOptions;
    }
    // если первый аргумент не определен, то объект
    // настроек ожидается во втором аргументе
    else {
      super();
    }
    // options
    if (options !== undefined) {
      if (!options || typeof options !== 'object' || Array.isArray(options)) {
        throw new InvalidArgumentError(
          'Parameter "options" must be an Object, but %v was given.',
          options,
        );
      }
      // options.origin
      if (options.origin !== undefined) {
        if (
          options.origin === '' ||
          (typeof options.origin !== 'boolean' &&
            typeof options.origin !== 'string' &&
            typeof options.origin !== 'function' &&
            !Array.isArray(options.origin) &&
            !(options.origin instanceof RegExp))
        ) {
          throw new InvalidArgumentError(
            'Option "origin" must be a Boolean, a non-empty String, ' +
              'an Array, a Function or an instance of RegExp, ' +
              'but %v was given.',
            options.origin,
          );
        }
        // options.origin[n]
        if (Array.isArray(options.origin)) {
          options.origin.forEach((el, index) => {
            if (
              (el === '' || typeof el !== 'string') &&
              !(el instanceof RegExp)
            ) {
              throw new InvalidArgumentError(
                'Element %d of the option "origin" must be a non-empty String ' +
                  'or an instance of RegExp, but %v was given.',
                index,
                el,
              );
            }
          });
        }
      }
      // options.methods
      if (options.methods !== undefined) {
        if (
          options.methods === '' ||
          (typeof options.methods !== 'string' &&
            !Array.isArray(options.methods))
        ) {
          throw new InvalidArgumentError(
            'Option "methods" must be a non-empty String or an Array, ' +
              'but %v was given.',
            options.methods,
          );
        }
        // options.methods[n]
        if (Array.isArray(options.methods)) {
          options.methods.forEach((el, index) => {
            if (!el || typeof el !== 'string') {
              throw new InvalidArgumentError(
                'Element %d of the option "methods" must be ' +
                  'a non-empty String, but %v was given.',
                index,
                el,
              );
            }
          });
        }
      }
      // options.allowedHeaders
      if (options.allowedHeaders !== undefined) {
        if (
          options.allowedHeaders === '' ||
          (typeof options.allowedHeaders !== 'string' &&
            !Array.isArray(options.allowedHeaders))
        ) {
          throw new InvalidArgumentError(
            'Option "allowedHeaders" must be a non-empty String ' +
              'or an Array, but %v was given.',
            options.allowedHeaders,
          );
        }
        // options.allowedHeaders[n]
        if (Array.isArray(options.allowedHeaders)) {
          options.allowedHeaders.forEach((el, index) => {
            if (!el || typeof el !== 'string') {
              throw new InvalidArgumentError(
                'Element %d of the option "allowedHeaders" must be ' +
                  'a non-empty String, but %v was given.',
                index,
                el,
              );
            }
          });
        }
      }
      // options.exposedHeaders
      if (options.exposedHeaders !== undefined) {
        if (
          options.exposedHeaders === '' ||
          (typeof options.exposedHeaders !== 'string' &&
            !Array.isArray(options.exposedHeaders))
        ) {
          throw new InvalidArgumentError(
            'Option "exposedHeaders" must be a non-empty String ' +
              'or an Array, but %v was given.',
            options.exposedHeaders,
          );
        }
        // options.exposedHeaders[n]
        if (Array.isArray(options.exposedHeaders)) {
          options.exposedHeaders.forEach((el, index) => {
            if (!el || typeof el !== 'string') {
              throw new InvalidArgumentError(
                'Element %d of the option "exposedHeaders" must be ' +
                  'a non-empty String, but %v was given.',
                index,
                el,
              );
            }
          });
        }
      }
      // options.credentials
      if (
        options.credentials !== undefined &&
        typeof options.credentials !== 'boolean'
      ) {
        throw new InvalidArgumentError(
          'Option "credentials" must be a Boolean, but %v was given.',
          options.credentials,
        );
      }
      // options.maxAge
      if (options.maxAge !== undefined) {
        if (typeof options.maxAge !== 'number' || !(options.maxAge > 0)) {
          throw new InvalidArgumentError(
            'Option "maxAge" must be a positive Number, but %v was given.',
            options.maxAge,
          );
        }
      }
      this._options = {...this._options, ...options};
    }
    const hookRegistry = this.getService(RouterHookRegistry);
    if (
      !hookRegistry.hasHook(RouterHookType.ON_REQUEST, onRequestCorsHandler)
    ) {
      hookRegistry.addHook(RouterHookType.ON_REQUEST, onRequestCorsHandler);
    }
  }

  /**
   * Проверка допуска Origin.
   *
   * @param {string|undefined} requestOrigin
   * @returns {boolean|Promise<boolean>}
   */
  _isOriginAllowed(requestOrigin) {
    if (typeof requestOrigin !== 'string') {
      throw new InvalidArgumentError(
        'Parameter "requestOrigin" must be a String, but %v was given.',
        requestOrigin,
      );
    }
    const origin = this._options.origin;
    if (origin === false) {
      return false;
    }
    if (origin === true || origin === '*') {
      return true;
    }
    if (typeof origin === 'string') {
      return origin.toLowerCase() === requestOrigin.toLowerCase();
    }
    if (origin instanceof RegExp) {
      return origin.test(requestOrigin);
    }
    if (Array.isArray(origin)) {
      return origin.some(rule => {
        if (typeof rule === 'string') {
          return rule === requestOrigin;
        }
        if (rule instanceof RegExp) {
          return rule.test(requestOrigin);
        }
        return false;
      });
    }
    if (typeof origin === 'function') {
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
    // если источник запроса не разрешен,
    // то установка заголовков пропускается
    if (!isOriginAllowed) {
      return;
    }
    const options = this['_options'];
    // Access-Control-Allow-Origin
    if (options.origin === '*' && !options.credentials) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    } else {
      // если требуются credentials или origin не "*",
      // то отражается Origin запроса и добавляется Vary
      if (requestOrigin) {
        res.setHeader('Access-Control-Allow-Origin', requestOrigin);
        appendVaryHeader(res, 'Origin');
      }
      // если требуются credentials, но Origin не определен,
      // то согласно спецификации Fetch нельзя допускать
      // любые источники символом "*"
    }
    // Access-Control-Allow-Credentials
    if (options.credentials === true) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    // обработка стандартного запроса (не OPTIONS)
    if (req.method !== HttpMethod.OPTIONS) {
      if (options.exposedHeaders) {
        res.setHeader(
          'Access-Control-Expose-Headers',
          Array.isArray(options.exposedHeaders)
            ? options.exposedHeaders.join(',')
            : options.exposedHeaders,
        );
      }
      return;
    }
    // обработка preflight запроса (OPTIONS)
    // Access-Control-Allow-Methods
    if (options.methods !== undefined) {
      res.setHeader(
        'Access-Control-Allow-Methods',
        Array.isArray(options.methods)
          ? options.methods.join(',')
          : options.methods,
      );
    }
    // Access-Control-Allow-Headers
    if (options.allowedHeaders !== undefined) {
      res.setHeader(
        'Access-Control-Allow-Headers',
        Array.isArray(options.allowedHeaders)
          ? options.allowedHeaders.join(',')
          : options.allowedHeaders,
      );
    } else if (req.headers['access-control-request-headers']) {
      // если параметр "allowedHeaders" не задан, то выполняется
      // зеркалирование запрашиваемых клиентом заголовков
      res.setHeader(
        'Access-Control-Allow-Headers',
        req.headers['access-control-request-headers'],
      );
      // Vary
      appendVaryHeader(res, 'Access-Control-Request-Headers');
    }
    // Access-Control-Max-Age
    if (options.maxAge !== undefined) {
      res.setHeader('Access-Control-Max-Age', String(options.maxAge));
    }
    // прерывание запроса
    // 204 No Content
    res.statusCode = 204;
    res.end();
    // флаг для маршрутизатора, что необходимо
    // прервать обработку запроса
    return true;
  }
}

/**
 * On request cors handler.
 *
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 * @param {import('@e22m4u/js-service').ServiceContainer} container
 * @returns {Promise<boolean>|boolean|undefined}
 */
export function onRequestCorsHandler(req, res, container) {
  const inst = container.getRegistered(TrieRouterCors);
  const options = inst['_options'];
  const requestOrigin = req.headers.origin || '';
  // если запрос не содержит заголовка Origin и опция "origin"
  // не имеет значения "*", то установка CORS заголовков пропускается
  // (не кросс-доменный запрос), но если опция имеет значение "*",
  // то заголовки CORS отправляются несмотря на отсутствие Origin
  if (!requestOrigin && options.origin !== '*') {
    return;
  }
  const isAllowedOrPromise = inst._isOriginAllowed(requestOrigin);
  if (isPromise(isAllowedOrPromise)) {
    return isAllowedOrPromise.then(isOriginAllowed => {
      return inst._applyCorsHeaders(req, res, requestOrigin, isOriginAllowed);
    });
  }
  return inst._applyCorsHeaders(req, res, requestOrigin, isAllowedOrPromise);
}

/**
 * Добавляет значение в существующий Vary заголовок.
 *
 * @param {import('http').ServerResponse} res
 * @param {string} newHeader
 */
function appendVaryHeader(res, newHeader) {
  const currentVary = res.getHeader('Vary');
  if (!currentVary) {
    res.setHeader('Vary', newHeader);
    return;
  }
  const varyStr = Array.isArray(currentVary)
    ? currentVary.join(',')
    : String(currentVary);
  const regex = new RegExp(`(?:^|,)\\s*${newHeader}\\s*(?:,|$)`, 'i');
  if (regex.test(varyStr)) {
    return;
  }
  res.setHeader('Vary', varyStr + ',' + newHeader);
}
