export type EnumRecord<E extends string | number, V> = Record<E, V> & Iterable<V>;

// Loosely adapted from: https://github.com/microsoft/TypeScript/issues/4753#issuecomment-694557208
type EnumType<T> = { [name: string]: T }

export function enumValuesFor<T extends string>(enumeration: EnumType<T>): T[];
export function enumValuesFor<T extends string | number>(enumeration: EnumType<T>): Exclude<T, string>[];
export function enumValuesFor<T>(enumeration: EnumType<T>): T[] {
  const isStringEnum = Object.values(enumeration).every((value) => typeof value === 'string');
  return Object.values(enumeration).filter((value) => isStringEnum || typeof value === 'number');
}

export function enumRecordFor<T extends string, V extends (value: T) => unknown>(enumeration: EnumType<T>, mapFv: V): EnumRecord<T, ReturnType<V>>;
export function enumRecordFor<T extends string | number, V extends (value: Exclude<T, string>) => unknown>(enumeration: EnumType<T>, mapFn: V): EnumRecord<Exclude<T, string>, ReturnType<V>>;
export function enumRecordFor<T extends string | number, V extends (value: T) => unknown>(enumeration: EnumType<T>, mapFn: V): EnumRecord<T, ReturnType<V>> {
  const values = enumValuesFor(enumeration);
  const record = Object.assign({}, ...values.map((value) => ({ [value]: mapFn(value) })));
  Object.defineProperty(record, Symbol.iterator, {
    value: () => Object.values(record).values()
  });
  return record;
}

export function enumSizeFor<T extends string | number>(enumeration: EnumType<T>): number {
  return enumValuesFor(enumeration).length;
}

// See: https://stackoverflow.com/a/69756175
export type PickByType<T, Value> = {
  [P in keyof T as T[P] extends Value | undefined ? P : never]: T[P]
}

// See: https://github.com/microsoft/TypeScript/issues/5863#issuecomment-1336204919
export type ThisConstructor<
  T extends { prototype: unknown } = { prototype: unknown },
> = T;

export type This<T extends ThisConstructor> = T['prototype'];
