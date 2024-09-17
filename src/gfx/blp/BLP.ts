import { DataReader } from '../../utils/DataReader';
import { CompressionType } from './CompressionType';
import { BLPType } from './BLPType';
import { Decode, kDxt1, kDxt3, kDxt5 } from './DXT';

export class BLP {
  private _identifier: string = '';
  private _type: BLPType = BLPType.UKNOWN;
  private _compression: CompressionType = CompressionType.UNKNOWN;
  private _alphaDepth: number = 0;
  private _alphaType: number = 0;
  private _hasMips: boolean = false;
  private _width: number = 0;
  private _height: number = 0;
  private _mipmapOffsets: number[] = [];
  private _mipmapLengths: number[] = [];
  private _palette: number[] = [];
  private _imageData: Uint8Array = new Uint8Array();

  static fromArray(array: ArrayBuffer): BLP {
    return BLP.fromDataReader(new DataReader(array));
  }

  static fromDataReader(reader: DataReader): BLP {
    const result = new BLP();
    result._identifier = reader.readAscii(4);
    if (result._identifier !== 'BLP2') {
      throw new Error('Unknown BLP file format');
    }

    result._type = reader.readUint32();
    result._compression = reader.readUint8();
    result._alphaDepth = reader.readUint8();
    result._alphaType = reader.readUint8();
    result._hasMips = reader.readUint8() === 1;
    result._width = reader.readUint32();
    result._height = reader.readUint32();

    for (let i = 0; i < 16; i++) {
      result._mipmapOffsets.push(reader.readUint32());
    }
    for (let i = 0; i < 16; i++) {
      result._mipmapLengths.push(reader.readUint32());
    }
    for (let i = 0; i < 256; i++) {
      result._palette.push(reader.readUint32());
    }

    const imageData = reader.readToEnd();
    const rgba = new Uint8Array((result._width * result._height) * 4);
    const flag = result.isDXT1 ? kDxt1 : (result.isDXT3 ? kDxt3 : (result.isDXT5 ? kDxt5 : 0));
    Decode(rgba, result._width, result._height, imageData, flag);
    result._imageData = rgba;
    return result;
  }

  get type(): BLPType {
    return this._type;
  }

  get isDXT1(): boolean {
    return this._type === BLPType.BLP && this._compression === CompressionType.DXTC && this._alphaType === 0;
  }

  get isDXT3(): boolean {
    return this._type === BLPType.BLP && this._compression === CompressionType.DXTC && this._alphaType === 1;
  }

  get isDXT5(): boolean {
    return this._type === BLPType.BLP && this._compression === CompressionType.DXTC && this._alphaType > 1;
  }

  get imageData(): Uint8Array {
    return this._imageData;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get alphaDepth(): number {
    return this._alphaDepth;
  }

  get hasMips(): boolean {
    return this._hasMips;
  }
}
