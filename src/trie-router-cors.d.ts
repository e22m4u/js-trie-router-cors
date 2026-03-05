import {Service, ServiceContainer} from '@e22m4u/js-service';

/**
 * Default cors allowed method.
 */
export declare const DEFAULT_CORS_ALLOWED_METHODS: string;

/**
 * Функция для проверки допуска Origin.
 */
export type TrieRouterCorsOriginPredicate = (
  origin: string,
  container: ServiceContainer,
) => Promise<boolean> | boolean;

/**
 * Trie router cors options.
 */
export type TrieRouterCorsOptions = {
  /**
   * Источник(и).
   * 
   * `false`    - отключает CORS заголовки (по умолчанию);  
   * `true`     - отражает источник запроса в разрешающем заголовке;  
   * `string`   - значение передается в разрешающий заголовок;  
   * `RegExp`   - регулярное выражение для проверки источника;  
   * `Array`    - массив допустимых источников или регулярных выражений;  
   * `Function` - функция для проверки источника;  
   */
  origin?:
    | boolean
    | string
    | RegExp
    | (string | RegExp)[]
    | TrieRouterCorsOriginPredicate;

  /**
   * Разрешенные HTTP методы.
   * 
   * По умолчанию: `GET,HEAD,PUT,PATCH,POST,DELETE`
   */
  methods?: string | string[];

  /**
   * Разрешенные заголовки.
   * 
   * Если не указано, модуль использует принцип "Эхо"
   * и разрешит те заголовки, которые клиент запросит в 
   * заголовке 'Access-Control-Request-Headers'.
   */
  allowedHeaders?: string | string[];

  /**
   * Заголовки, которые будут доступны клиенту.
   */
  exposedHeaders?: string | string[];

  /**
   * Разрешить отправку Cookie/Credentials.
   */
  credentials?: boolean;

  /**
   * Время кэширования Preflight-ответа в секундах.
   */
  maxAge?: number;
};

/**
 * Trie router cors.
 */
export declare class TrieRouterCors extends Service {
  /**
   * Constructor.
   *
   * @param container
   */
  constructor(container: ServiceContainer);

  /**
   * Constructor.
   *
   * @param options
   */
  constructor(options: TrieRouterCorsOptions);

  /**
   * Constructor.
   *
   * @param container
   * @param options
   */
  constructor(container: ServiceContainer, options: TrieRouterCorsOptions);
}
