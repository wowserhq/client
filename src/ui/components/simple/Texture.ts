import Client from '../../../Client';
import Device from '../../../gfx/Device';
import DrawLayerType from '../../DrawLayerType';
import GfxTexture from '../../../gfx/Texture';
import Region from './Region';
import RenderBatch from '../../rendering/RenderBatch';
import Shader from '../../../gfx/Shader';
import UIContext from '../../UIContext';
import WebGL2Device from '../../../gfx/apis/webgl2/WebGL2Device';
import XMLNode from '../../XMLNode';
import { BlendMode } from '../../../gfx/types';
import { Rect, Vector2, Vector3 } from '../../../math';
import { stringToBlendMode } from '../../utils';
import {
  NDCtoDDCHeight,
  NDCtoDDCWidth,
  maxAspectCompensation,
  stringToBoolean,
  stringToFloat,
} from '../../../utils';

import Frame from './Frame';
import TextureImageMode from './TextureImageMode';
import * as scriptFunctions from './Texture.script';

type TexturePosition = readonly [Vector3, Vector3, Vector3, Vector3];
type TextureCoords = readonly [Vector2, Vector2, Vector2, Vector2];

class Texture extends Region {
  static indices = [
    0, 1, 2,
    2, 1, 3,
  ];

  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }

  blendMode: BlendMode;
  position: TexturePosition;
  shader: Shader;
  texture: GfxTexture | null;
  textureCoords: TextureCoords;
  tileHorizontally: boolean;
  tileVertically: boolean;
  updateTextureCoords: boolean;

  constructor(frame: Frame, drawLayerType: DrawLayerType, show: boolean) {
    super(frame, drawLayerType, show);

    this.blendMode = BlendMode.Alpha;
    this.position = [
      new Vector3(),
      new Vector3(),
      new Vector3(),
      new Vector3(),
    ];
    this.shader = (Device.instance as WebGL2Device).shaders.pixelShaderFor(TextureImageMode.UI);
    this.texture = null;
    this.textureCoords = [
      new Vector2([0, 0]),
      new Vector2([0, 1]),
      new Vector2([1, 0]),
      new Vector2([1, 1]),
    ];
    this.tileHorizontally = false;
    this.tileVertically = false;
    this.updateTextureCoords = false;
  }

  get width() {
    const layoutwidth = super.width;
    if (layoutwidth !== 0.0) {
      return layoutwidth;
    }

    if (this.texture && this.texture.isLoaded) {
      const { width } = this.texture;
      const ndcWidth = width / maxAspectCompensation;
      const ddcWidth = NDCtoDDCWidth(ndcWidth);
      return ddcWidth;
    }

    return 0.0;
  }

  set width(width) {
    super.width = width;
  }

  get height() {
    const layoutHeight = super.height;
    if (layoutHeight !== 0.0) {
      return layoutHeight;
    }

    if (this.texture && this.texture.isLoaded) {
      const { height } = this.texture;
      const ndcHeight = height / maxAspectCompensation;
      const ddcHeight = NDCtoDDCHeight(ndcHeight);
      return ddcHeight;
    }

    return 0.0;
  }

  set height(height) {
    super.height = height;
  }

  loadXML(node: XMLNode) {
    const alphaMode = node.attributes.get('alphaMode');
    const file = node.attributes.get('file');
    const hidden = node.attributes.get('hidden');
    const inherits = node.attributes.get('inherits');
    const tileHorizontally = node.attributes.get('horizTile');
    const tileVertically = node.attributes.get('horizTile');

    if (inherits) {
      const template = UIContext.instance.templates.get(inherits);
      if (template) {
        if (template.locked) {
          // TODO: Error handling
        } else {
          template.lock();
          this.loadXML(template.node);
          template.release();
        }
      } else {
        // TODO: Error handling
      }
    }

    super.loadXML(node);

    if (hidden) {
      if (stringToBoolean(hidden)) {
        this.hide();
      } else {
        this.show();
      }
    }

    let wrapU = false;
    let wrapV = false;

    if (tileHorizontally) {
      this.tileHorizontally = stringToBoolean(tileHorizontally);
      wrapU = true;
    }

    if (tileVertically) {
      this.tileVertically = stringToBoolean(tileVertically);
      wrapV = true;
    }

    for (const child of node.children) {
      const iname = child.name.toLowerCase();
      switch (iname) {
        case 'texcoords': {
          let valid = true;

          const rect = {
            left: 0.0,
            right: 1.0,
            top: 0.0,
            bottom: 1.0,
          };

          // TODO: Handle name in error handling
          // const name = this.name || '<unnamed>';

          // TODO: Handle rectangle
          if (child.getChildByName('Rect')) {
            continue;
          }

          for (const side of Object.keys(rect) as (keyof typeof rect)[]) {
            const attr = child.attributes.get(side);
            if (attr) {
              if (
                ((side === 'left' || side === 'right') && this.tileHorizontally)
                || ((side === 'top' || side === 'bottom') && this.tileVertically)
              ) {
                // TODO: error handling
                valid = false;
              }

              const value = stringToFloat(attr);
              if (value < -10000 || value > 10000) {
                // TODO: Error handling
                valid = false;
              }
              rect[side] = value;
            }
          }

          if (valid) {
            const coords = [
              new Vector2([rect.left, rect.top]),
              new Vector2([rect.left, rect.bottom]),
              new Vector2([rect.right, rect.top]),
              new Vector2([rect.right, rect.bottom]),
            ] as const;

            this.setTextureCoords(coords);

            wrapU = (
              rect.left < 0 || rect.left > 1
              || rect.right < 0 || rect.right > 1
            );

            wrapV = (
              rect.top < 0 || rect.top > 1
              || rect.bottom < 0 || rect.bottom > 1
            );
          }
        }  break;
        case 'color':
          // TODO: Color
          break;
        case 'gradient':
          // TODO: Gradient
          break;
      }
    }

    if (file) {
      // TODO: Handle all arguments correctly
      const success = this.setTexture(file, wrapU, wrapV, null, TextureImageMode.UI);
      if (success) {
        // TODO: Set colors
      } else {
        // TODO: Error handling
      }
    }

    if (alphaMode) {
      const blendMode = stringToBlendMode(alphaMode);
      if (blendMode) {
        this.setBlendMode(blendMode);
      }
    }

    // TODO: Non-blocking
  }

  postLoadXML(_node: XMLNode) {
    // TODO
  }

  onFrameSizeChanged(rect: Rect) {
    super.onFrameSizeChanged(rect);

    this.setPosition(this.rect);

    if (this.tileHorizontally || this.tileVertically) {
      this.updateTextureCoords = true;
      this.onRegionChanged();
    }

    // TODO: Notify scroll parent
  }

  setBlendMode(blendMode: BlendMode) {
    if (this.blendMode === blendMode) {
      return;
    }

    this.blendMode = blendMode;
    this.onRegionChanged();
  }

  setPosition(rect: Rect) {
    this.position[0].setElements(rect.minX, rect.maxY, this.layoutDepth);
    this.position[1].setElements(rect.minX, rect.minY, this.layoutDepth);
    this.position[2].setElements(rect.maxX, rect.maxY, this.layoutDepth);
    this.position[3].setElements(rect.maxX, rect.minY, this.layoutDepth);

    console.debug('setting position for', this.name, 'to:', this.position);
  }

  // TODO: Create flags
  setTexture(filename: string, _wrapU: boolean, _wrapV: boolean, _filter: unknown, imageMode: TextureImageMode) {
    let texture = null;

    if (filename) {
      // TODO: Remaining texture flags
      // TODO: No longer accurate, needs a refactor
      // TODO: const _flags = new TextureFlags(TextureFilter.Linear, wrapU, wrapV);
      texture = Client.instance.textures.lookup(filename);

      // TODO: Verify texture

      this.shader = (Device.instance as WebGL2Device).shaders.pixelShaderFor(imageMode);
    }

    // TODO: Texture cleanup

    this.texture = texture;
    this.onRegionChanged();
    return true;
  }

  setTextureCoords(coords: TextureCoords) {
    this.textureCoords[0].set(coords[0]);
    this.textureCoords[1].set(coords[1]);
    this.textureCoords[2].set(coords[2]);
    this.textureCoords[3].set(coords[3]);
  }

  draw(batch: RenderBatch) {
    if (this.texture) {
      batch.queueTexture(this);
    }
  }
}

export default Texture;
export { type TextureCoords, type TexturePosition };
