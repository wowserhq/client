
export class DataReader {
  protected currentByteOffset: number;
  private dataView: DataView;
  private textDecoder: TextDecoder;

  constructor(protected data: ArrayBuffer) {
    this.currentByteOffset = 0;
    this.dataView = new DataView(data);
    this.textDecoder = new TextDecoder('ascii');
  }

  public readInt8(): number {
    return this.readNumber(1, true);
  }

  public readInt16(): number {
    return this.readNumber(2, true);
  }

  public readInt32(): number {
    return this.readNumber(4, true);
  }

  public readUint8(): number {
    return this.readNumber(1);
  }

  public readUint16(): number {
    return this.readNumber(2);
  }

  public readUint32(): number {
    return this.readNumber(4);
  }

  public readFloat(): number {
    const val = this.dataView.getFloat32(this.currentByteOffset, true);
    this.currentByteOffset += 4;
    return val;
  }

  public readDouble(): number {
    const val = this.dataView.getFloat64(this.currentByteOffset, true);
    this.currentByteOffset += 8;
    return val;
  }

  public readAscii(length: number): string {
    const data = this.read(length);
    let value = this.textDecoder.decode(data);
    if (value.includes('\0')) {
      value = value.slice(0, value.indexOf('\0'));
    }
    return value;
  }

  public readNullTerminatedString(): string {
    const data: number[] = [];
    while (data.length === 0 || data.at(data.length - 1) !== 0) {
      data.push(this.readUint8());
    }
    return this.textDecoder.decode(new Uint8Array(data.slice(0, -1)));
  }

  public readNumber(byteCount: number, signed = false): number {
    const array = this.read(byteCount);
    const isNegative = signed && (array[byteCount - 1] & 0x80) === 0x80;
    let result = 0;
    for (let i = 0; i < byteCount; i++) {
      if (array[i] === undefined) {
        throw new Error(`Byte ${i} of array is not set` + array.toString());
      }
      result += (isNegative ? (~array[i]) & 0xFF : array[i]) * Math.pow(2, i * 8);
    }
    if (isNegative) {
      result =  (result + 1) * -1;
    }
    return result;
  }

  public readRaw(offset: number, length: number): Uint8Array {
    if (offset + length > this.data.length) {
      throw Error(`Invalid file offset ${offset + length} is greater than the total length (${this.data.length})`);
    }
    return this.data.slice(offset, offset + length);
  }

  public writeUint8(value: number) {
    this.dataView.setUint8(this.currentByteOffset, value);
    this.currentByteOffset += 1;
  }

  public writeUint16(value: number) {
    this.dataView.setUint16(this.currentByteOffset, value, true);
    this.currentByteOffset += 2;
  }

  public writeUint32(value: number) {
    this.dataView.setUint32(this.currentByteOffset, value, true);
    this.currentByteOffset += 4;
  }

  public writeInt8(value: number) {
    this.dataView.setUint8(this.currentByteOffset, value);
    this.currentByteOffset += 1;
  }

  public writeInt16(value: number) {
    this.dataView.setUint16(this.currentByteOffset, value, true);
    this.currentByteOffset += 2;
  }

  public writeInt32(value: number) {
    this.dataView.setUint32(this.currentByteOffset, value, true);
    this.currentByteOffset += 4;
  }

  /*public writeAscii(value: string) {
    const data = value.split('').map((c) => c.charCodeAt(0));
    this.data.set(data, this.currentByteOffset);
    this.currentByteOffset += data.length;
  }*/

  public seek(byteNumber: number): void {
    if (byteNumber >= this.length) {
      throw new RangeError(`Cannot seek to byte ${byteNumber} in a ${this.length} byte array`);
    }
    this.currentByteOffset = byteNumber;
  }

  public get hasReachedEnd(): boolean {
    return this.currentByteOffset === this.length - 1;
  }

  public get length(): number {
    return this.data.byteLength;
  }

  public get pos(): number {
    return this.currentByteOffset;
  }

  public read(numBytes: number): Uint8Array {
    const offset = this.currentByteOffset;
    if ((offset + numBytes) > this.length) {
      throw new RangeError(`Cannot read bytes ${offset} to ${offset + numBytes} of a ${this.length} byte array`);
    }
    this.currentByteOffset = offset + numBytes;
    return new Uint8Array(this.data.slice(offset, offset + numBytes));
  }

  public readToEnd(): Uint8Array {
    const amount = this.length - this.currentByteOffset;
    return this.read(amount);
  }
}