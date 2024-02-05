import {
  BlendMode,
  PoolTarget,
  PoolUsage,
  PrimitiveType,
} from '../../types';

const cubeMapFaces = {
  0: 'TEXTURE_CUBE_MAP_POSITIVE_X',
  1: 'TEXTURE_CUBE_MAP_NEGATIVE_X',
  2: 'TEXTURE_CUBE_MAP_POSITIVE_Y',
  3: 'TEXTURE_CUBE_MAP_NEGATIVE_Y',
  4: 'TEXTURE_CUBE_MAP_POSITIVE_Z',
  5: 'TEXTURE_CUBE_MAP_NEGATIVE_Z',
} as const;

const blendDestinations = {
  [BlendMode.Opaque]: 'ZERO',
  [BlendMode.AlphaKey]: 'ZERO',
  [BlendMode.Alpha]: 'ONE_MINUS_SRC_ALPHA',
  [BlendMode.Add]: 'ONE',
  [BlendMode.Mod]: 'ZERO',
  [BlendMode.Mod2x]: 'SRC_COLOR',
  [BlendMode.ModAdd]: 'ONE',
  [BlendMode.InvSrcAlphaAdd]: 'ONE',
  [BlendMode.InvSrcAlphaOpaque]: 'ZERO',
  [BlendMode.SrcAlphaOpaque]: 'ZERO',
  [BlendMode.NoAlphaAdd]: 'ONE',
  [BlendMode.ConstantAlpha]: 'ONE_MINUS_CONSTANT_ALPHA',
} as const;

const blendSources = {
  [BlendMode.Opaque]: 'ONE',
  [BlendMode.AlphaKey]: 'ONE',
  [BlendMode.Alpha]: 'SRC_ALPHA',
  [BlendMode.Add]: 'SRC_ALPHA',
  [BlendMode.Mod]: 'DST_COLOR',
  [BlendMode.Mod2x]: 'DST_COLOR',
  [BlendMode.ModAdd]: 'DST_COLOR',
  [BlendMode.InvSrcAlphaAdd]: 'ONE_MINUS_SRC_ALPHA',
  [BlendMode.InvSrcAlphaOpaque]: 'ONE_MINUS_SRC_ALPHA',
  [BlendMode.SrcAlphaOpaque]: 'SRC_ALPHA',
  [BlendMode.NoAlphaAdd]: 'ONE',
  [BlendMode.ConstantAlpha]: 'CONSTANT_ALPHA',
} as const;

// TODO: Texture format

const bufferFormatByPoolTarget = {
  [PoolTarget.Vertex]: 'ZERO',
  [PoolTarget.Index]: 'UNSIGNED_SHORT',
} as const;

const bufferTypeByPooltarget = {
  [PoolTarget.Vertex]: 'ARRAY_BUFFER',
  [PoolTarget.Index]: 'ELEMENT_ARRAY_BUFFER',
} as const;

const bufferUsageByPoolTarget = {
  [PoolUsage.Static]: 'STATIC_DRAW',
  [PoolUsage.Dynamic]: 'DYNAMIC_DRAW',
  [PoolUsage.Stream]: 'DYNAMIC_DRAW',
} as const;

const primitiveTypes = {
  [PrimitiveType.Points]: 'POINTS',
  [PrimitiveType.Lines]: 'LINES',
  [PrimitiveType.LineStrip]: 'LINE_STRIP',
  [PrimitiveType.Triangles]: 'TRIANGLES',
  [PrimitiveType.TriangleStrip]: 'TRIANGLE_STRIP',
  [PrimitiveType.TriangleFan]: 'TRIANGLE_FAN',
} as const;

export default (gl: WebGL2RenderingContext) => {
  const constants = {};

  const categories = {
    cubeMapFaces,
    blendDestinations,
    blendSources,
    bufferFormatByPoolTarget,
    bufferTypeByPooltarget,
    bufferUsageByPoolTarget,
    primitiveTypes,
  } as const;

  for (const [name, category] of Object.entries(categories)) {
    const entry = {};
    for (const [index, prop] of Object.entries(category)) {
      const constant = gl[prop];
      if (constant === undefined) {
        throw new Error(`Could not find WebGL2 constant: ${prop}`);
      }
      // @ts-expect-error: currently unused (and untyped)
      entry[index] = constant;
    }
    // @ts-expect-error: currently unused (and untyped)
    constants[name] = entry;
  }

  return constants;
};
