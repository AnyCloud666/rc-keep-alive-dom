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
