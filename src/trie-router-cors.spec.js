import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {ServiceContainer} from '@e22m4u/js-service';

import {
  TrieRouterCors,
  onRequestCorsHandler,
  DEFAULT_CORS_ALLOWED_METHODS as DEFAULT_METHODS,
} from './trie-router-cors.js';

import {
  TrieRouter,
  HttpMethod,
  RouterHookType,
  createRequestMock,
  createResponseMock,
  RouterHookRegistry,
} from '@e22m4u/js-trie-router';

const EXAMPLE_ORIGIN = 'http://example.com';
const AC_ALLOW_ORIGIN = 'Access-Control-Allow-Origin';
const AC_ALLOW_METHODS = 'Access-Control-Allow-Methods';
const AC_ALLOW_HEADERS = 'Access-Control-Allow-Headers';
const AC_ALLOW_CREDENTIALS = 'Access-Control-Allow-Credentials';
const AC_EXPOSE_HEADERS = 'Access-Control-Expose-Headers';
const AC_REQUEST_HEADERS = 'Access-Control-Request-Headers';
const AC_MAX_AGE = 'Access-Control-Max-Age';
const ORIGIN_HEADER = 'Origin';
const VARY_HEADER = 'Vary';

const CORS_HEADERS = [
  AC_ALLOW_ORIGIN,
  AC_ALLOW_METHODS,
  AC_ALLOW_HEADERS,
  AC_ALLOW_CREDENTIALS,
  AC_EXPOSE_HEADERS,
  AC_MAX_AGE,
];

describe('TrieRouterCors', function () {
  describe('constructor', function () {
    it('should allow the first parameter to be an instance of ServiceContainer or an Object', function () {
      const throwable = v => () => new TrieRouterCors(v);
      const error = v =>
        format(
          'First parameter must be an Object ' +
            'or an instance of ServiceContainer, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(new ServiceContainer())();
      throwable({})();
      throwable(undefined)();
    });

    it('should require the parameter "options" to be an Object', function () {
      const throwable = v => () => new TrieRouterCors(undefined, v);
      const error = v =>
        format('Parameter "options" must be an Object, but %s was given.', v);
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(null)).to.throw(error('null'));
      throwable({})();
      throwable(undefined)();
    });

    it('should use options from the first parameter', function () {
      const S = new TrieRouterCors({origin: 'test'});
      expect(S['_options'].origin).to.be.eq('test');
    });

    it('should use options from the second parameter', function () {
      const S = new TrieRouterCors(undefined, {origin: 'test'});
      expect(S['_options'].origin).to.be.eq('test');
    });

    it('should require the option "origin" to be a correct value', function () {
      const throwable = v => () => new TrieRouterCors({origin: v});
      const error = v =>
        format(
          'Option "origin" must be a Boolean, a non-empty String, ' +
            'an Array, a Function or an instance of RegExp, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable({})).to.throw(error('Object'));
      throwable('str')();
      throwable(true)();
      throwable(false)();
      throwable([])();
      throwable(() => true)();
      throwable(/test/)();
      throwable(undefined)();
    });

    it('should require elements of the option "origin" to be a correct value', function () {
      const throwable = v => () => new TrieRouterCors({origin: [v]});
      const error = v =>
        format(
          'Element 0 of the option "origin" must be a non-empty String ' +
            'or an instance of RegExp, but %s was given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable('str')();
      throwable(/test/)();
    });

    it('should require the option "methods" to be a correct value', function () {
      const throwable = v => () => new TrieRouterCors({methods: v});
      const error = v =>
        format(
          'Option "methods" must be a non-empty String or an Array, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable('str')();
      throwable([])();
      throwable(undefined)();
    });

    it('should require elements of the option "methods" to be a correct value', function () {
      const throwable = v => () => new TrieRouterCors({methods: [v]});
      const error = v =>
        format(
          'Element 0 of the option "methods" must be a non-empty String, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable('str')();
    });

    it('should require the option "allowedHeaders" to be a correct value', function () {
      const throwable = v => () => new TrieRouterCors({allowedHeaders: v});
      const error = v =>
        format(
          'Option "allowedHeaders" must be a non-empty String or an Array, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable('str')();
      throwable([])();
      throwable(undefined)();
    });

    it('should require elements of the option "allowedHeaders" to be a correct value', function () {
      const throwable = v => () => new TrieRouterCors({allowedHeaders: [v]});
      const error = v =>
        format(
          'Element 0 of the option "allowedHeaders" must be a non-empty String, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable('str')();
    });

    it('should require the option "exposedHeaders" to be a correct value', function () {
      const throwable = v => () => new TrieRouterCors({exposedHeaders: v});
      const error = v =>
        format(
          'Option "exposedHeaders" must be a non-empty String or an Array, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable('str')();
      throwable([])();
      throwable(undefined)();
    });

    it('should require elements of the option "exposedHeaders" to be a correct value', function () {
      const throwable = v => () => new TrieRouterCors({exposedHeaders: [v]});
      const error = v =>
        format(
          'Element 0 of the option "exposedHeaders" must be a non-empty String, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable('str')();
    });

    it('should require the option "credentials" to be a Boolean', function () {
      const throwable = v => () => new TrieRouterCors({credentials: v});
      const error = v =>
        format('Option "credentials" must be a Boolean, but %s was given.', v);
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should require the option "maxAge" to be a positive Number', function () {
      const throwable = v => () => new TrieRouterCors({maxAge: v});
      const error = v =>
        format(
          'Option "maxAge" must be a positive Number, but %s was given.',
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(-1)).to.throw(error('-1'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(10)();
      throwable(1)();
      throwable(undefined)();
    });

    it('should register the hook "onRequest" only once', function () {
      const router = new TrieRouter();
      const registry = router.getService(RouterHookRegistry);
      const res1 = registry.getHooks(RouterHookType.ON_REQUEST);
      expect(res1).to.be.eql([]);
      router.useService(TrieRouterCors);
      const res2 = registry.getHooks(RouterHookType.ON_REQUEST);
      expect(res2).to.be.eql([onRequestCorsHandler]);
      router.useService(TrieRouterCors);
      const res3 = registry.getHooks(RouterHookType.ON_REQUEST);
      expect(res3).to.be.eql([onRequestCorsHandler]);
    });
  });

  describe('_isOriginAllowed', function () {
    it('should throw an error if the parameter "requestOrigin" is not a String', function () {
      const S = new TrieRouterCors();
      const throwable = v => () => S._isOriginAllowed(v);
      const error = v =>
        format(
          'Parameter "requestOrigin" must be a String, but %s was given.',
          v,
        );

      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable('str')();
      throwable('')();
    });

    it('should return false if the option "origin" is explicitly false', function () {
      const S = new TrieRouterCors({origin: false});
      expect(S._isOriginAllowed(EXAMPLE_ORIGIN)).to.be.false;
    });

    it('should return false by default if the option "origin" is not provided', function () {
      const S = new TrieRouterCors();
      expect(S._isOriginAllowed(EXAMPLE_ORIGIN)).to.be.false;
    });

    it('should return true if the option "origin" is true', function () {
      const S = new TrieRouterCors({origin: true});
      expect(S._isOriginAllowed(EXAMPLE_ORIGIN)).to.be.true;
      expect(S._isOriginAllowed('')).to.be.true;
    });

    it('should return true if the option "origin" is "*"', function () {
      const S = new TrieRouterCors({origin: '*'});
      expect(S._isOriginAllowed(EXAMPLE_ORIGIN)).to.be.true;
      expect(S._isOriginAllowed('null')).to.be.true;
    });

    it('should return true if a string matches case-insensitively', function () {
      const S = new TrieRouterCors({origin: 'http://Example.com'});
      expect(S._isOriginAllowed(EXAMPLE_ORIGIN)).to.be.true;
      expect(S._isOriginAllowed('HTTP://EXAMPLE.COM')).to.be.true;
    });

    it('should return false if a string does not match', function () {
      const S = new TrieRouterCors({origin: EXAMPLE_ORIGIN});
      expect(S._isOriginAllowed('http://other.com')).to.be.false;
      expect(S._isOriginAllowed('https://example.com')).to.be.false;
    });

    it('should return true if a regular expression matches', function () {
      const S = new TrieRouterCors({origin: /\.example\.com$/});
      expect(S._isOriginAllowed('http://api.example.com')).to.be.true;
      expect(S._isOriginAllowed('https://www.example.com')).to.be.true;
    });

    it('should return false if a regular expression does not match', function () {
      const S = new TrieRouterCors({origin: /\.example\.com$/});
      expect(S._isOriginAllowed('http://example.org')).to.be.false;
    });

    it('should check against an array of strings and regular expressions', function () {
      const S = new TrieRouterCors({
        origin: ['http://specific.com', /\.sub\.com$/],
      });
      expect(S._isOriginAllowed('http://specific.com')).to.be.true;
      expect(S._isOriginAllowed('http://a.sub.com')).to.be.true;
      expect(S._isOriginAllowed('http://other.com')).to.be.false;
    });

    it('should use a function to determine allowance', function () {
      const S = new TrieRouterCors({
        origin: origin => origin === 'http://allowed.com',
      });
      expect(S._isOriginAllowed('http://allowed.com')).to.be.true;
      expect(S._isOriginAllowed('http://blocked.com')).to.be.false;
    });

    it('should pass the option "origin" and ServiceContainer to the function', function () {
      let passedOrigin;
      let passedContainer;
      const S = new TrieRouterCors({
        origin: (o, c) => {
          passedOrigin = o;
          passedContainer = c;
          return true;
        },
      });
      S._isOriginAllowed('http://test.com');
      expect(passedOrigin).to.be.eq('http://test.com');
      expect(passedContainer).to.be.eq(S.container);
    });

    it('should support asynchronous function to return a Promise', async function () {
      const S = new TrieRouterCors({
        origin: async origin => origin === 'http://async.com',
      });
      const resultTrue = S._isOriginAllowed('http://async.com');
      expect(resultTrue).to.be.instanceOf(Promise);
      expect(await resultTrue).to.be.true;
      const resultFalse = S._isOriginAllowed('http://other.com');
      expect(await resultFalse).to.be.false;
    });
  });

  describe('_applyCorsHeaders', function () {
    it('should not set response headers when the request origin is not allowed', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterCors);
      const req = createRequestMock();
      const res = createResponseMock();
      S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, false);
      expect(res.getHeaders()).to.be.eql({});
    });

    it('should set the header "Access-Control-Allow-Origin" to "*" when the option "origin" is "*" and the option "credentials" is false', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterCors, {
        origin: '*',
        credentials: false,
      });
      const req = createRequestMock();
      const res = createResponseMock();
      S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
      expect(res.getHeader(AC_ALLOW_ORIGIN)).to.be.eq('*');
    });

    it('should reflect the request origin when the option "origin" is "*" and the option "credentials" is true', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterCors, {
        origin: '*',
        credentials: true,
      });
      const req = createRequestMock();
      const res = createResponseMock();
      S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
      expect(res.getHeader(AC_ALLOW_ORIGIN)).to.be.eq(EXAMPLE_ORIGIN);
      expect(res.getHeader(AC_ALLOW_CREDENTIALS)).to.be.eq('true');
      expect(res.getHeader(VARY_HEADER)).to.be.eq('Origin');
    });

    it('should reflect the request origin when the option "origin" is true', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterCors, {origin: true});
      const req = createRequestMock();
      const res = createResponseMock();
      S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
      expect(res.getHeader(AC_ALLOW_ORIGIN)).to.be.eq(EXAMPLE_ORIGIN);
    });

    it('should reflect the request origin when the option "credentials" is true', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterCors, {credentials: true});
      const req = createRequestMock();
      const res = createResponseMock();
      S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
      expect(res.getHeader(AC_ALLOW_ORIGIN)).to.be.eq(EXAMPLE_ORIGIN);
    });

    it('should set the header "Vary" when the option "origin" is true', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterCors, {origin: true});
      const req = createRequestMock();
      const res = createResponseMock();
      S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
      expect(res.getHeader(VARY_HEADER)).to.be.eq(ORIGIN_HEADER);
    });

    it('should set the header "Vary" when the option "credentials" is true', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterCors, {credentials: true});
      const req = createRequestMock();
      const res = createResponseMock();
      S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
      expect(res.getHeader(VARY_HEADER)).to.be.eq(ORIGIN_HEADER);
    });

    it('should append headers to an existing "Vary" header with a string value', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterCors, {origin: true});
      const req = createRequestMock();
      const res = createResponseMock();
      res.setHeader(VARY_HEADER, 'Foo, Bar');
      S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
      expect(res.getHeader(VARY_HEADER)).to.be.eq('Foo, Bar, Origin');
    });

    it('should ignore existing headers in the "Vary" header with a string value', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterCors, {origin: true});
      const req = createRequestMock();
      const res = createResponseMock();
      res.setHeader(VARY_HEADER, 'Foo, Bar, Origin');
      S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
      expect(res.getHeader(VARY_HEADER)).to.be.eq('Foo, Bar, Origin');
    });

    it('should append headers to an existing "Vary" header with an array value', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterCors, {origin: true});
      const req = createRequestMock();
      const res = createResponseMock();
      res.setHeader(VARY_HEADER, ['Foo', 'Bar']);
      S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
      expect(res.getHeader(VARY_HEADER)).to.be.eql(['Foo', 'Bar', 'Origin']);
    });

    it('should ignore existing headers in the "Vary" header with an array value', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterCors, {origin: true});
      const req = createRequestMock();
      const res = createResponseMock();
      res.setHeader(VARY_HEADER, ['Foo', 'Bar', 'Origin']);
      S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
      expect(res.getHeader(VARY_HEADER)).to.be.eql(['Foo', 'Bar', 'Origin']);
    });

    it('should set the header "Access-Control-Allow-Credentials" when the option "credentials" is true', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterCors, {credentials: true});
      const req = createRequestMock();
      const res = createResponseMock();
      S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
      expect(res.getHeader(AC_ALLOW_CREDENTIALS)).to.be.eq('true');
    });

    it('should set the header "Access-Control-Expose-Headers" from the option "exposedHeaders" with a string value', function () {
      const router = new TrieRouter();
      const exposedHeaders = 'Foo, Bar';
      const S = router.getService(TrieRouterCors, {exposedHeaders});
      const req = createRequestMock();
      const res = createResponseMock();
      S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
      expect(res.getHeader(AC_EXPOSE_HEADERS)).to.be.eq(exposedHeaders);
    });

    it('should set the header "Access-Control-Expose-Headers" from the option "exposedHeaders" with an array value', function () {
      const router = new TrieRouter();
      const exposedHeaders = ['Foo', 'Bar'];
      const expectedValue = exposedHeaders.join(', ');
      const S = router.getService(TrieRouterCors, {exposedHeaders});
      const req = createRequestMock();
      const res = createResponseMock();
      S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
      expect(res.getHeader(AC_EXPOSE_HEADERS)).to.be.eq(expectedValue);
    });

    it('should return undefined and do not send response for a non-preflight request', function () {
      const router = new TrieRouter();
      const S = router.getService(TrieRouterCors);
      const req = createRequestMock();
      const res = createResponseMock();
      const result = S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
      expect(res.headersSent).to.be.false;
      expect(result).to.be.undefined;
    });

    describe('for an OPTIONS request', function () {
      it('should set the header "Access-Control-Allow-Methods" by default', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterCors);
        const req = createRequestMock({method: HttpMethod.OPTIONS});
        const res = createResponseMock();
        S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
        expect(res.getHeader(AC_ALLOW_METHODS)).to.be.eq(DEFAULT_METHODS);
      });

      it('should set the header "Access-Control-Allow-Methods" from the option "methods" with a string value', function () {
        const router = new TrieRouter();
        const methods = 'POST,DELETE,OPTIONS';
        const S = router.getService(TrieRouterCors, {methods});
        const req = createRequestMock({method: HttpMethod.OPTIONS});
        const res = createResponseMock();
        S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
        expect(res.getHeader(AC_ALLOW_METHODS)).to.be.eq(methods);
      });

      it('should set the header "Access-Control-Allow-Methods" from the option "methods" with an array value', function () {
        const router = new TrieRouter();
        const methods = [HttpMethod.POST, HttpMethod.OPTIONS];
        const expectedValue = methods.join(', ');
        const S = router.getService(TrieRouterCors, {methods});
        const req = createRequestMock({method: HttpMethod.OPTIONS});
        const res = createResponseMock();
        S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
        expect(res.getHeader(AC_ALLOW_METHODS)).to.be.eq(expectedValue);
      });

      it('should not set the header "Access-Control-Allow-Headers" by default', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterCors);
        const req = createRequestMock({method: HttpMethod.OPTIONS});
        const res = createResponseMock();
        S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
        expect(res.getHeader(AC_ALLOW_HEADERS)).to.be.undefined;
      });

      it('should set the header "Access-Control-Allow-Headers" from the option "allowedHeaders" with a string value', function () {
        const router = new TrieRouter();
        const allowedHeaders = 'Foo, Bar';
        const S = router.getService(TrieRouterCors, {allowedHeaders});
        const req = createRequestMock({method: HttpMethod.OPTIONS});
        const res = createResponseMock();
        S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
        expect(res.getHeader(AC_ALLOW_HEADERS)).to.be.eq(allowedHeaders);
      });

      it('should set the header "Access-Control-Allow-Headers" from the option "allowedHeaders" with an array value', function () {
        const router = new TrieRouter();
        const allowedHeaders = ['Foo', 'Bar'];
        const S = router.getService(TrieRouterCors, {allowedHeaders});
        const expectedValue = allowedHeaders.join(', ');
        const req = createRequestMock({method: HttpMethod.OPTIONS});
        const res = createResponseMock();
        S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
        expect(res.getHeader(AC_ALLOW_HEADERS)).to.be.eq(expectedValue);
      });

      it('should reflect the provided "Access-Control-Request-Headers" request header', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterCors);
        const headers = 'Foo, Bar';
        const req = createRequestMock({
          method: HttpMethod.OPTIONS,
          headers: {[AC_REQUEST_HEADERS]: headers},
        });
        const res = createResponseMock();
        S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
        expect(res.getHeader(AC_ALLOW_HEADERS)).to.be.eq(headers);
      });

      it('should set the header "Vary" when the header "Access-Control-Request-Headers" is provided', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterCors);
        const expectedVary = [ORIGIN_HEADER, AC_REQUEST_HEADERS].join(', ');
        const req = createRequestMock({
          method: HttpMethod.OPTIONS,
          headers: {[AC_REQUEST_HEADERS]: 'Foo, Bar'},
        });
        const res = createResponseMock();
        S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
        expect(res.getHeader(VARY_HEADER)).to.be.eq(expectedVary);
      });

      it('should not set the header "Access-Control-Max-Age" by default', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterCors);
        const req = createRequestMock({method: HttpMethod.OPTIONS});
        const res = createResponseMock();
        S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
        expect(res.getHeader(AC_MAX_AGE)).to.be.undefined;
      });

      it('should set the header "Access-Control-Max-Age" from the "maxAge" option', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterCors, {maxAge: 1000});
        const req = createRequestMock({method: HttpMethod.OPTIONS});
        const res = createResponseMock();
        S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
        expect(res.getHeader(AC_MAX_AGE)).to.be.eq('1000');
      });

      it('should return true and send 204 status code', function () {
        const router = new TrieRouter();
        const S = router.getService(TrieRouterCors);
        const req = createRequestMock({method: HttpMethod.OPTIONS});
        const res = createResponseMock();
        const result = S._applyCorsHeaders(req, res, EXAMPLE_ORIGIN, true);
        expect(res.statusCode).to.be.eq(204);
        expect(res.headersSent).to.be.true;
        expect(result).to.be.true;
      });
    });
  });

  describe('on request', function () {
    it('should catch errors thrown in an "origin" function and respond with 500', async function () {
      const router = new TrieRouter();
      const message = 'Database connection failed during origin check.';
      router.useService(TrieRouterCors, {
        origin: () => {
          throw new Error(message);
        },
      });
      const req = createRequestMock({headers: {origin: EXAMPLE_ORIGIN}});
      const res = createResponseMock();
      await router.handleRequest(req, res);
      expect(res.statusCode).to.be.eq(500);
      const body = await res.getBody();
      expect(JSON.parse(body)).to.be.eql({error: {message}});
    });

    it('should catch errors thrown in an async "origin" function and respond with 500', async function () {
      const router = new TrieRouter();
      const message = 'Database connection failed during origin check.';
      router.useService(TrieRouterCors, {
        origin: async () => {
          throw new Error(message);
        },
      });
      const req = createRequestMock({headers: {origin: EXAMPLE_ORIGIN}});
      const res = createResponseMock();
      await router.handleRequest(req, res);
      expect(res.statusCode).to.be.eq(500);
      const body = await res.getBody();
      expect(JSON.parse(body)).to.be.eql({error: {message}});
    });

    describe('for a non-preflight request', function () {
      it('should not set CORS headers by default', async function () {
        const router = new TrieRouter();
        router.useService(TrieRouterCors);
        const req = createRequestMock();
        const res = createResponseMock();
        await router.handleRequest(req, res);
        CORS_HEADERS.forEach(header => {
          expect(res.getHeader(header)).to.be.undefined;
        });
      });

      it('should not set CORS headers even when the "Origin" header is provided', async function () {
        const router = new TrieRouter();
        router.useService(TrieRouterCors);
        const req = createRequestMock({headers: {origin: EXAMPLE_ORIGIN}});
        const res = createResponseMock();
        await router.handleRequest(req, res);
        CORS_HEADERS.forEach(header => {
          expect(res.getHeader(header)).to.be.undefined;
        });
      });
    });

    describe('for an OPTIONS request', function () {
      it('should not set CORS headers by default', async function () {
        const router = new TrieRouter();
        router.useService(TrieRouterCors);
        const req = createRequestMock({method: HttpMethod.OPTIONS});
        const res = createResponseMock();
        await router.handleRequest(req, res);
        CORS_HEADERS.forEach(header => {
          expect(res.getHeader(header)).to.be.undefined;
        });
      });

      it('should not set CORS headers even when the "Origin" header is provided', async function () {
        const router = new TrieRouter();
        router.useService(TrieRouterCors);
        const req = createRequestMock({
          method: HttpMethod.OPTIONS,
          headers: {origin: EXAMPLE_ORIGIN},
        });
        const res = createResponseMock();
        await router.handleRequest(req, res);
        CORS_HEADERS.forEach(header => {
          expect(res.getHeader(header)).to.be.undefined;
        });
      });
    });

    describe('when the option "origin" is true', function () {
      describe('for a non-preflight request', function () {
        it('should not set CORS headers when the request origin is not provided', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterCors, {origin: true});
          const req = createRequestMock();
          const res = createResponseMock();
          await router.handleRequest(req, res);
          CORS_HEADERS.forEach(header => {
            expect(res.getHeader(header)).to.be.undefined;
          });
        });

        it('should set correct headers when the request origin is provided', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterCors, {origin: true});
          const req = createRequestMock({headers: {origin: EXAMPLE_ORIGIN}});
          const res = createResponseMock();
          await router.handleRequest(req, res);
          expect(res.getHeader(AC_ALLOW_ORIGIN)).to.be.eq(EXAMPLE_ORIGIN);
          expect(res.getHeader(AC_ALLOW_METHODS)).to.be.undefined;
          expect(res.getHeader(AC_ALLOW_HEADERS)).to.be.undefined;
          expect(res.getHeader(AC_ALLOW_CREDENTIALS)).to.be.undefined;
          expect(res.getHeader(AC_EXPOSE_HEADERS)).to.be.undefined;
          expect(res.getHeader(AC_MAX_AGE)).to.be.undefined;
          expect(res.getHeader(VARY_HEADER)).to.be.eq(ORIGIN_HEADER);
        });
      });

      describe('for an OPTIONS request', function () {
        it('should not set CORS headers when the request origin is not provided', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterCors, {origin: true});
          const req = createRequestMock({method: HttpMethod.OPTIONS});
          const res = createResponseMock();
          await router.handleRequest(req, res);
          CORS_HEADERS.forEach(header => {
            expect(res.getHeader(header)).to.be.undefined;
          });
        });

        it('should not set CORS headers when the request origin is provided', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterCors, {origin: true});
          const req = createRequestMock({
            method: HttpMethod.OPTIONS,
            headers: {origin: EXAMPLE_ORIGIN},
          });
          const res = createResponseMock();
          await router.handleRequest(req, res);
          expect(res.getHeader(AC_ALLOW_ORIGIN)).to.be.eq(EXAMPLE_ORIGIN);
          expect(res.getHeader(AC_ALLOW_METHODS)).to.be.eq(DEFAULT_METHODS);
          expect(res.getHeader(AC_ALLOW_HEADERS)).to.be.undefined;
          expect(res.getHeader(AC_ALLOW_CREDENTIALS)).to.be.undefined;
          expect(res.getHeader(AC_EXPOSE_HEADERS)).to.be.undefined;
          expect(res.getHeader(AC_MAX_AGE)).to.be.undefined;
          expect(res.getHeader(VARY_HEADER)).to.be.eq(ORIGIN_HEADER);
        });
      });
    });

    describe('when the option "origin" is "*"', function () {
      describe('for a non-preflight request', function () {
        it('should set correct headers when the request origin is not provided', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterCors, {origin: '*'});
          const req = createRequestMock();
          const res = createResponseMock();
          await router.handleRequest(req, res);
          expect(res.getHeader(AC_ALLOW_ORIGIN)).to.be.eq('*');
          expect(res.getHeader(AC_ALLOW_METHODS)).to.be.undefined;
          expect(res.getHeader(AC_ALLOW_HEADERS)).to.be.undefined;
          expect(res.getHeader(AC_ALLOW_CREDENTIALS)).to.be.undefined;
          expect(res.getHeader(AC_EXPOSE_HEADERS)).to.be.undefined;
          expect(res.getHeader(AC_MAX_AGE)).to.be.undefined;
          expect(res.getHeader(VARY_HEADER)).to.be.undefined;
        });

        it('should set correct headers when the request origin is provided', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterCors, {origin: '*'});
          const req = createRequestMock({headers: {origin: EXAMPLE_ORIGIN}});
          const res = createResponseMock();
          await router.handleRequest(req, res);
          expect(res.getHeader(AC_ALLOW_ORIGIN)).to.be.eq('*');
          expect(res.getHeader(AC_ALLOW_METHODS)).to.be.undefined;
          expect(res.getHeader(AC_ALLOW_HEADERS)).to.be.undefined;
          expect(res.getHeader(AC_ALLOW_CREDENTIALS)).to.be.undefined;
          expect(res.getHeader(AC_EXPOSE_HEADERS)).to.be.undefined;
          expect(res.getHeader(AC_MAX_AGE)).to.be.undefined;
          expect(res.getHeader(VARY_HEADER)).to.be.undefined;
        });
      });

      describe('for an OPTIONS request', function () {
        it('should set correct headers when the request origin is not provided', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterCors, {origin: '*'});
          const req = createRequestMock({method: HttpMethod.OPTIONS});
          const res = createResponseMock();
          await router.handleRequest(req, res);
          expect(res.getHeader(AC_ALLOW_ORIGIN)).to.be.eq('*');
          expect(res.getHeader(AC_ALLOW_METHODS)).to.be.eq(DEFAULT_METHODS);
          expect(res.getHeader(AC_ALLOW_HEADERS)).to.be.undefined;
          expect(res.getHeader(AC_ALLOW_CREDENTIALS)).to.be.undefined;
          expect(res.getHeader(AC_EXPOSE_HEADERS)).to.be.undefined;
          expect(res.getHeader(AC_MAX_AGE)).to.be.undefined;
          expect(res.getHeader(VARY_HEADER)).to.be.undefined;
        });

        it('should set correct headers when the request origin is provided', async function () {
          const router = new TrieRouter();
          router.useService(TrieRouterCors, {origin: '*'});
          const req = createRequestMock({
            method: HttpMethod.OPTIONS,
            headers: {origin: EXAMPLE_ORIGIN},
          });
          const res = createResponseMock();
          await router.handleRequest(req, res);
          expect(res.getHeader(AC_ALLOW_ORIGIN)).to.be.eq('*');
          expect(res.getHeader(AC_ALLOW_METHODS)).to.be.eq(DEFAULT_METHODS);
          expect(res.getHeader(AC_ALLOW_HEADERS)).to.be.undefined;
          expect(res.getHeader(AC_ALLOW_CREDENTIALS)).to.be.undefined;
          expect(res.getHeader(AC_EXPOSE_HEADERS)).to.be.undefined;
          expect(res.getHeader(AC_MAX_AGE)).to.be.undefined;
          expect(res.getHeader(VARY_HEADER)).to.be.undefined;
        });
      });
    });
  });
});
