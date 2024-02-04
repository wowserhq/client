import Texture from '../../ui/components/simple/Texture';
import {
  DDCtoNDCHeight,
  DDCtoNDCWidth,
  LinkedListLink,
  maxAspectCompensation,
} from '../../utils';
import { Rect } from '../../math';

import RenderMesh from './RenderMesh';

class RenderBatch {
  constructor(drawLayerType) {
    this.drawLayerType = drawLayerType;

    this.meshes = [];
    this.count = 0;

    this.renderLink = new LinkedListLink(this);
  }

  clear() {
    this.meshes = [];
    // TODO: Clear strings
    // TODO: Clear callbacks
    this.count = 0;
  }

  finish() {
    if (this.meshes.length > 0) {
      // TODO: Sort meshes
    }
  }

  // TODO: Too many arguments, potentially use options (may impact performance)
  queue(
    texture, blendMode, position, textureCoords,
    colors, indices, shader,
  ) {
    const mesh = new RenderMesh();
    mesh.texture = texture;
    mesh.blendMode = blendMode;
    mesh.shader = shader;
    mesh.position = position;
    mesh.textureCoords = textureCoords;
    mesh.colors = colors;
    mesh.indices = indices;
    // TODO: Atlas implementation

    this.meshes.push(mesh);
    ++this.count;
  }

  queueTexture(texture) {
    if (!texture.texture.isLoaded) {
      return;
    }

    if (texture.isResizePending) {
      texture.resize(true);
    }

    // TODO: Check whether texture coords need updating
    if (texture.updateTextureCoords) {
      const { texCoords } = texture;

      const rect = new Rect({
        minY: texture.position[1].y,
        minX: texture.position[0].x,
        maxY: texture.position[0].y,
        maxX: texture.position[2].x,
      });

      if (texture.tileHorizontally) {
        const { width } = texture.texture;
        const ddcWidth = maxAspectCompensation * (rect.maxX - rect.minX);
        const ndcWidth = DDCtoNDCWidth(ddcWidth);

        if (width && ndcWidth > 0) {
          if (texCoords[0].x !== 0) {
            texCoords[0].x = ndcWidth / width;
          }

          if (texCoords[1].x !== 0) {
            texCoords[1].x = ndcWidth / width;
          }

          if (texCoords[2].x !== 0) {
            texCoords[2].x = ndcWidth / width;
          }

          if (texCoords[3].x !== 0) {
            texCoords[3].x = ndcWidth / width;
          }
        }
      }

      if (texture.tileVertically) {
        const { height } = texture.texture;
        const ddcHeight = maxAspectCompensation * (rect.maxY - rect.minY);
        const ndcHeight = DDCtoNDCHeight(ddcHeight);

        if (height && ndcHeight > 0.0) {
          if (texCoords[0].y !== 0.0) {
            texCoords[0].y = ndcHeight / height;
          }

          if (texCoords[1].y !== 0.0) {
            texCoords[1].y = ndcHeight / height;
          }

          if (texCoords[2].y !== 0.0) {
            texCoords[2].y = ndcHeight / height;
          }

          if (texCoords[3].y !== 0.0) {
            texCoords[3].y = ndcHeight / height;
          }
        }
      }

      texture.updateTextureCoords = false;
      texture.setTextureCoords(texCoords);
    }

    this.queue(
      texture.texture,
      texture.blendMode,
      texture.position,
      texture.textureCoords,
      // TODO: May require a color check here
      texture.colors,
      Texture.indices,
      texture.shader
    );
  }
}

export default RenderBatch;
