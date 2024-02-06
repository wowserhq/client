export let aspectRatio: number;
export let aspectCompensation: number;
export let maxAspectCompensation: number;
let x: number;
let y: number;

export const setAspectRatio = (newAspectRatio: number) => {
  aspectRatio = newAspectRatio;
  aspectCompensation = aspectRatio * 0.75;
  maxAspectCompensation = aspectCompensation * 1024.0;

  y = 1.0 / Math.sqrt(aspectRatio * aspectRatio + 1.0);
  x = aspectRatio * y;
};

export const DDCtoNDCWidth = (ddcx: number) => ddcx / x;
export const DDCtoNDCHeight = (ddcy: number) => ddcy / y;
export const DDCtoNDC = (ddcx: number, ddcy: number) => ({
  x: DDCtoNDCWidth(ddcx),
  y: DDCtoNDCHeight(ddcy),
});

export const NDCtoDDCWidth = (ndcx: number) => ndcx * x;
export const NDCtoDDCHeight = (ndcy: number) => ndcy * y;
export const NDCtoDDC = (ndcx: number, ndcy: number) => ({
  x: NDCtoDDCWidth(ndcx),
  y: NDCtoDDCHeight(ndcy),
});

// Set default aspect ratio
setAspectRatio(1024 / 768);
