import Device from '../../Device';

class WebGPUDevice extends Device {
  constructor() {
    super();
    throw new Error('WebGPU not yet supported');
  }
}

export default WebGPUDevice;
