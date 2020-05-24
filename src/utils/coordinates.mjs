export let aspectRatio = null;
export let aspectCompensation = null;
export let maxAspectCompensation = null;
let x = null;
let y = null;

export const setAspectRatio = (newAspectRatio) => {
  aspectRatio = newAspectRatio;
  aspectCompensation = aspectRatio * 0.75;
  maxAspectCompensation = aspectCompensation * 1024.0;

  y = 1.0 / Math.sqrt(aspectRatio * aspectRatio + 1.0);
  x = aspectRatio * y;
};

export const DDCtoNDCWidth = ddcx => ddcx / x;
export const DDCtoNDCHeight = ddcy => ddcy / y;
export const DDCtoNDC = (ddcx, ddcy) => ({
  x: DDCtoNDCWidth(ddcx),
  y: DDCtoNDCHeight(ddcy),
});

export const NDCtoDDCWidth = ndcx => ndcx * x;
export const NDCtoDDCHeight = ndcy => ndcy * y;
export const NDCtoDDC = (ndcx, ndcy) => ({
  x: NDCtoDDCWidth(ndcx),
  y: NDCtoDDCHeight(ndcy),
});

// Set default aspect ratio
setAspectRatio(1024 / 768);
