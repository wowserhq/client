import {
  BlendMode,
  PoolTarget,
  PoolUsage,
  PrimitiveType,
} from '../../types';

import { PickByType } from '../../../utils';

export default (gl: WebGL2RenderingContext) => {
  const resolve = (prop: keyof PickByType<WebGL2RenderingContext, number>): number => {
    const constant = gl[prop];
      if (constant === undefined) {
        throw new Error(`Could not find WebGL2 constant: ${prop}`);
      }
      return constant;
  };

  const constants = {
    cubeMapFaces: {
      0: resolve('TEXTURE_CUBE_MAP_POSITIVE_X'),
      1: resolve('TEXTURE_CUBE_MAP_NEGATIVE_X'),
      2: resolve('TEXTURE_CUBE_MAP_POSITIVE_Y'),
      3: resolve('TEXTURE_CUBE_MAP_NEGATIVE_Y'),
      4: resolve('TEXTURE_CUBE_MAP_POSITIVE_Z'),
      5: resolve('TEXTURE_CUBE_MAP_NEGATIVE_Z'),
    },

    blendDestinations: {
      [BlendMode.Opaque]: resolve('ZERO'),
      [BlendMode.AlphaKey]: resolve('ZERO'),
      [BlendMode.Alpha]: resolve('ONE_MINUS_SRC_ALPHA'),
      [BlendMode.Add]: resolve('ONE'),
      [BlendMode.Mod]: resolve('ZERO'),
      [BlendMode.Mod2x]: resolve('SRC_COLOR'),
      [BlendMode.ModAdd]: resolve('ONE'),
      [BlendMode.InvSrcAlphaAdd]: resolve('ONE'),
      [BlendMode.InvSrcAlphaOpaque]: resolve('ZERO'),
      [BlendMode.SrcAlphaOpaque]: resolve('ZERO'),
      [BlendMode.NoAlphaAdd]: resolve('ONE'),
      [BlendMode.ConstantAlpha]: resolve('ONE_MINUS_CONSTANT_ALPHA'),
    },

    blendSources: {
      [BlendMode.Opaque]: resolve('ONE'),
      [BlendMode.AlphaKey]: resolve('ONE'),
      [BlendMode.Alpha]: resolve('SRC_ALPHA'),
      [BlendMode.Add]: resolve('SRC_ALPHA'),
      [BlendMode.Mod]: resolve('DST_COLOR'),
      [BlendMode.Mod2x]: resolve('DST_COLOR'),
      [BlendMode.ModAdd]: resolve('DST_COLOR'),
      [BlendMode.InvSrcAlphaAdd]: resolve('ONE_MINUS_SRC_ALPHA'),
      [BlendMode.InvSrcAlphaOpaque]: resolve('ONE_MINUS_SRC_ALPHA'),
      [BlendMode.SrcAlphaOpaque]: resolve('SRC_ALPHA'),
      [BlendMode.NoAlphaAdd]: resolve('ONE'),
      [BlendMode.ConstantAlpha]: resolve('CONSTANT_ALPHA'),
    },

    // TODO: Texture format

    bufferFormatByPoolTarget: {
      [PoolTarget.Vertex]: resolve('ZERO'),
      [PoolTarget.Index]: resolve('UNSIGNED_SHORT'),
    },

    bufferTypeByPooltarget: {
      [PoolTarget.Vertex]: resolve('ARRAY_BUFFER'),
      [PoolTarget.Index]: resolve('ELEMENT_ARRAY_BUFFER'),
    },

    bufferUsageByPoolTarget: {
      [PoolUsage.Static]: resolve('STATIC_DRAW'),
      [PoolUsage.Dynamic]: resolve('DYNAMIC_DRAW'),
      [PoolUsage.Stream]: resolve('DYNAMIC_DRAW'),
    },

    primitiveTypes: {
      [PrimitiveType.Points]: resolve('POINTS'),
      [PrimitiveType.Lines]: resolve('LINES'),
      [PrimitiveType.LineStrip]: resolve('LINE_STRIP'),
      [PrimitiveType.Triangles]: resolve('TRIANGLES'),
      [PrimitiveType.TriangleStrip]: resolve('TRIANGLE_STRIP'),
      [PrimitiveType.TriangleFan]: resolve('TRIANGLE_FAN'),
    },
  };

  return constants;
};
