// See: https://github.com/microsoft/TypeScript/issues/5863#issuecomment-1336204919
export type ThisConstructor<
  T extends { prototype: unknown } = { prototype: unknown },
> = T;

export type This<T extends ThisConstructor> = T['prototype'];
