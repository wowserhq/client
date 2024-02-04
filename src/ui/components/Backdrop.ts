/* eslint-disable max-len */

import Color from '../../gfx/Color';
import DrawLayerType from '../DrawLayerType';
import { Vector2 } from '../../math';
import { extractInsetsFrom, extractValueFrom, stringToBoolean } from '../../utils';

import FramePointType from './abstract/FramePointType';
import Texture, { TextureImageMode } from './simple/Texture';

class Backdrop {
  constructor() {
    this.backgroundFile = null;
    this.backgroundSize = 0.0;

    this.edgeFile = null;
    this.edgeSize = 0.0;

    this.tileBackground = false;

    this.color = new Color(0xFFFFFFF);
    this.borderColor = new Color(0xFFFFFFF);

    // TODO: Default value
    this.blendMode = null;
    this.pieces = 0;

    this.backgroundTexture = null;
    this.leftTexture = null;
    this.rightTexture = null;
    this.topTexture = null;
    this.bottomTexture = null;
    this.topLeftTexture = null;
    this.topRightTexture = null;
    this.bottomLeftTexture = null;
    this.bottomRightTexture = null;

    this.topInset = 0.0;
    this.bottomInset = 0.0;
    this.leftInset = 0.0;
    this.rightInset = 0.0;
  }

  loadXML(node) {
    this.backgroundFile = node.attributes.get('bgFile');
    this.edgeFile = node.attributes.get('edgeFile');

    const tile = node.attributes.get('tile');
    this.tileBackground = stringToBoolean(tile, false);

    // TODO: Alpha mode & blend mode

    this.pieces = this.edgeFile ? 0xFF : 0x00;

    for (const child of node.children) {
      const iname = child.name.toLowerCase();
      switch (iname) {
        case 'tilesize': {
          const backgroundSize = extractValueFrom(child);
          if (backgroundSize !== undefined) {
            this.backgroundSize = backgroundSize;
          }
          break;
        }
        case 'edgesize': {
          const edgeSize = extractValueFrom(child);
          if (edgeSize !== undefined) {
            this.edgeSize = edgeSize;
          }
          break;
        }
        case 'backgroundinsets': {
          const insets = extractInsetsFrom(child);
          if (insets.left !== undefined) {
            this.leftInset = insets.left;
          }
          if (insets.right !== undefined) {
            this.rightInset = insets.right;
          }
          if (insets.top !== undefined) {
            this.topInset = insets.top;
          }
          if (insets.bottom !== undefined) {
            this.bottomInset = insets.bottom;
          }
          break;
        }
        // TODO: Color & border color
      }
    }
  }

  setOutput(frame) {
    const texCoords = [
      new Vector2(),
      new Vector2(),
      new Vector2(),
      new Vector2(),
    ];

    const { backgroundFile, edgeFile } = this;

    if (backgroundFile) {
      const bgTexture = new Texture(frame, DrawLayerType.BACKGROUND, 1);
      this.backgroundTexture = bgTexture;

      bgTexture.setPoint(FramePointType.TOPLEFT, frame, FramePointType.TOPLEFT, this.leftInset, -this.topInset, false);
      bgTexture.setPoint(FramePointType.TOPRIGHT, frame, FramePointType.TOPRIGHT, -this.rightInset, -this.topInset, false);
      bgTexture.setPoint(FramePointType.BOTTOMLEFT, frame, FramePointType.BOTTOMLEFT, this.leftInset, this.bottomInset, false);
      bgTexture.setPoint(FramePointType.BOTTOMRIGHT, frame, FramePointType.BOTTOMRIGHT, -this.rightInset, this.topInset, false);

      bgTexture.resize(false);

      bgTexture.setTexture(backgroundFile, this.tileBackground, false, null, TextureImageMode.UI);
    }

    if (this.pieces & 0x1) {
      const leftTexture = new Texture(frame, DrawLayerType.BORDER, true);
      this.leftTexture = leftTexture;

      leftTexture.width = this.edgeSize;
      leftTexture.setPoint(FramePointType.TOPLEFT, frame, FramePointType.TOPLEFT, 0.0, -this.edgeSize, false);
      leftTexture.setPoint(FramePointType.BOTTOMLEFT, frame, FramePointType.BOTTOMLEFT, 0.0, this.edgeSize, false);

      leftTexture.resize(false);

      leftTexture.setTexture(edgeFile, true, true, null, TextureImageMode.UI);
      // TODO: leftTexture.setBlendMode(this.blendMode);
    }

    if (this.pieces & 0x2) {
      const rightTexture = new Texture(frame, DrawLayerType.BORDER, true);
      this.rightTexture = rightTexture;

      rightTexture.width = this.edgeSize;
      rightTexture.setPoint(FramePointType.TOPRIGHT, frame, FramePointType.TOPRIGHT, 0.0, -this.edgeSize, false);
      rightTexture.setPoint(FramePointType.BOTTOMRIGHT, frame, FramePointType.BOTTOMRIGHT, 0.0, this.edgeSize, false);

      rightTexture.resize(false);

      rightTexture.setTexture(edgeFile, true, true, null, TextureImageMode.UI);
      // TODO: rightTexture.setBlendMode(this.blendMode);
    }

    if (this.pieces & 0x4) {
      const topTexture = new Texture(frame, DrawLayerType.BORDER, true);
      this.topTexture = topTexture;

      topTexture.height = this.edgeSize;
      topTexture.setPoint(FramePointType.TOPLEFT, frame, FramePointType.TOPLEFT, this.edgeSize, 0.0, false);
      topTexture.setPoint(FramePointType.TOPRIGHT, frame, FramePointType.TOPRIGHT, -this.edgeSize, 0.0, false);

      topTexture.resize(false);

      topTexture.setTexture(edgeFile, true, true, null, TextureImageMode.UI);
      // TODO: topTexture.setBlendMode(this.blendMode);
    }

    if (this.pieces & 0x8) {
      const bottomTexture = new Texture(frame, DrawLayerType.BORDER, true);
      this.bottomTexture = bottomTexture;

      bottomTexture.height = this.edgeSize;
      bottomTexture.setPoint(FramePointType.BOTTOMLEFT, frame, FramePointType.BOTTOMLEFT, this.edgeSize, 0.0, false);
      bottomTexture.setPoint(FramePointType.BOTTOMRIGHT, frame, FramePointType.BOTTOMRIGHT, -this.edgeSize, 0.0, false);

      bottomTexture.resize(false);

      bottomTexture.setTexture(edgeFile, true, true, null, TextureImageMode.UI);
      // TODO: bottomTexture.setBlendMode(this.blendMode);
    }

    if (this.pieces & 0x10) {
      const topLeftTexture = new Texture(frame, DrawLayerType.BORDER, true);
      this.topLeftTexture = topLeftTexture;

      topLeftTexture.width = this.edgeSize;
      topLeftTexture.height = this.edgeSize;
      topLeftTexture.setPoint(FramePointType.TOPLEFT, frame, FramePointType.TOPLEFT, 0.0, 0.0, true);

      texCoords[0].setElements(0.5078125, 0.0625);
      texCoords[1].setElements(0.5078125, 0.9375);
      texCoords[2].setElements(0.6171875, 0.0625);
      texCoords[3].setElements(0.6171875, 0.9375);

      topLeftTexture.setTexture(edgeFile, false, false, null, TextureImageMode.UI);
      topLeftTexture.setTextureCoords(texCoords);
      // TODO: topLeftTexture.setBlendMode(this.blendMode);
    }

    if (this.pieces & 0x20) {
      const topRightTexture = new Texture(frame, DrawLayerType.BORDER, true);
      this.topRightTexture = topRightTexture;

      topRightTexture.width = this.edgeSize;
      topRightTexture.height = this.edgeSize;
      topRightTexture.setPoint(FramePointType.TOPRIGHT, frame, FramePointType.TOPRIGHT, 0.0, 0.0, true);

      texCoords[0].setElements(0.6328125, 0.0625);
      texCoords[1].setElements(0.6328125, 0.9375);
      texCoords[2].setElements(0.7421875, 0.0625);
      texCoords[3].setElements(0.7421875, 0.9375);

      topRightTexture.setTexture(edgeFile, false, false, null, TextureImageMode.UI);
      topRightTexture.setTextureCoords(texCoords);
      // TODO: topRightTexture.setBlendMode(this.blendMode);
    }

    if (this.pieces & 0x40) {
      const bottomLeftTexture = new Texture(frame, DrawLayerType.BORDER, true);
      this.bottomLeftTexture = bottomLeftTexture;

      bottomLeftTexture.width = this.edgeSize;
      bottomLeftTexture.height = this.edgeSize;
      bottomLeftTexture.setPoint(FramePointType.BOTTOMLEFT, frame, FramePointType.BOTTOMLEFT, 0.0, 0.0, true);

      texCoords[0].setElements(0.7578125, 0.0625);
      texCoords[1].setElements(0.7578125, 0.9375);
      texCoords[2].setElements(0.8671875, 0.0625);
      texCoords[3].setElements(0.8671875, 0.9375);

      bottomLeftTexture.setTexture(edgeFile, false, false, null, TextureImageMode.UI);
      bottomLeftTexture.setTextureCoords(texCoords);
      // TODO: bottomLeftTexture.setBlendMode(this.blendMode);
    }

    if (this.pieces & 0x80) {
      const bottomRightTexture = new Texture(frame, DrawLayerType.BORDER, true);
      this.bottomRightTexture = bottomRightTexture;

      bottomRightTexture.width = this.edgeSize;
      bottomRightTexture.height = this.edgeSize;
      bottomRightTexture.setPoint(FramePointType.BOTTOMRIGHT, frame, FramePointType.BOTTOMRIGHT, 0.0, 0.0, true);

      texCoords[0].setElements(0.8828125, 0.0625);
      texCoords[1].setElements(0.8828125, 0.9375);
      texCoords[2].setElements(0.9921875, 0.0625);
      texCoords[3].setElements(0.9921875, 0.9375);

      bottomRightTexture.setTexture(edgeFile, false, false, null, TextureImageMode.UI);
      bottomRightTexture.setTextureCoords(texCoords);
      // TODO: bottomRightTexture.setBlendMode(this.blendMode);
    }
  }

  update(rect) {
    const texCoords = [
      new Vector2(),
      new Vector2(),
      new Vector2(),
      new Vector2(),
    ];

    const width = rect.maxX - rect.minX;
    const height = rect.maxY - rect.minY;

    const edgeRatio = 1.0 / this.edgeSize;

    // TODO: Proper variable names
    const v5 = edgeRatio * width - 2.0;
    const v9 = edgeRatio * height - 2.0;
    const v34 = v5 < 0.0 ? 0.0 : v5;
    const v17 = v9 < 0.0 ? 0.0 : v9;

    if (this.backgroundFile) {
      const size = this.backgroundSize === 0.0 ? this.edgeSize : this.backgroundSize;

      texCoords[0].setElements(0.0, 0.0);
      texCoords[1].setElements(0.0, height / size);
      texCoords[2].setElements(width / size, 0.0);
      texCoords[3].setElements(width / size, height / size);

      this.backgroundTexture.setTextureCoords(texCoords);
    }

    if (this.pieces & 0x1) {
      texCoords[0].setElements(0.0078125, 0.0625);
      texCoords[1].setElements(0.0078125, v17 - 0.0625);
      texCoords[2].setElements(0.1171875, 0.0625);
      texCoords[3].setElements(0.1171875, v17 - 0.0625);

      this.leftTexture.setTextureCoords(texCoords);
    }

    if (this.pieces & 0x2) {
      texCoords[0].setElements(0.1328125, 0.0625);
      texCoords[1].setElements(0.1328125, v17 - 0.0625);
      texCoords[2].setElements(0.2421875, 0.0625);
      texCoords[3].setElements(0.2421875, v17 - 0.0625);

      this.rightTexture.setTextureCoords(texCoords);
    }

    if (this.pieces & 0x4) {
      texCoords[0].setElements(0.2578125, v34 - 0.0625);
      texCoords[1].setElements(0.3671875, v34 - 0.0625);
      texCoords[2].setElements(0.2578125, 0.0625);
      texCoords[3].setElements(0.3671875, 0.0625);

      this.topTexture.setTextureCoords(texCoords);
    }

    if (this.pieces & 0x8) {
      texCoords[0].setElements(0.3828125, v34 - 0.0625);
      texCoords[1].setElements(0.4921875, v34 - 0.0625);
      texCoords[2].setElements(0.3828125, 0.0625);
      texCoords[3].setElements(0.4921875, 0.0625);

      this.bottomTexture.setTextureCoords(texCoords);
    }

    // TODO: Set vertex colors
  }
}

export default Backdrop;
