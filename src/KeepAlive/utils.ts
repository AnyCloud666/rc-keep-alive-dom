import { startTransition } from 'react';

/**
 * 是 null 或 undefined ？
 *
 * @export
 * @param {*} value
 * @return {*}  {boolean}
 */
export function isNil(value: any): boolean {
  return value === null || value === undefined;
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

export function isRegExp(value: any): value is RegExp {
  return Object.prototype.toString.call(value) === '[object RegExp]';
}

export function isInclude(
  include: Array<string | RegExp> | string | RegExp | undefined,
  val: string,
) {
  const includes = isArray(include)
    ? include
    : isArray(include)
    ? []
    : [include];
  return includes.some((include) => {
    if (isRegExp(include)) {
      return include.test(val);
    } else {
      return val === include;
    }
  });
}

export function delayAsync(milliseconds: number = 100): Promise<void> {
  let _timeID: NodeJS.Timeout;
  return new Promise<void>((resolve) => {
    _timeID = setTimeout(() => {
      resolve();
      if (!isNil(_timeID)) {
        clearTimeout(_timeID);
      }
    }, milliseconds);
  });
}

/**
 * 安全的切换缓存
 *
 * 没有该方法时，首次切换路由时会存在闪烁问题
 *
 * @export
 * @param {() => void} callback
 */
export function safeStartTransition(callback: () => void) {
  if (typeof startTransition === 'function') {
    startTransition(callback);
  } else {
    callback();
  }
}
