/* eslint-disable import/prefer-default-export */

import {
  NDCtoDDCHeight,
  NDCtoDDCWidth,
  maxAspectCompensation,
} from './coordinates';

export const extractDimensionsFrom = (node) => {
  let x = undefined;
  let y = undefined;

  let xValue = node.attributes.get('x');
  if (xValue != null) {
    const ndcx = parseFloat(xValue) / maxAspectCompensation;
    x = NDCtoDDCWidth(ndcx);
  }

  let yValue = node.attributes.get('y');
  if (yValue != null) {
    const ndcy = parseFloat(yValue) / maxAspectCompensation;
    y = NDCtoDDCHeight(ndcy);
  }

  const child = node.firstChild;
  if (child) {
    const iname = child.name.toLowerCase();
    switch (iname) {
      case 'reldimension':
        xValue = child.attributes.get('x');
        if (xValue != null) {
          x = parseFloat(xValue);
        }

        yValue = child.attributes.get('y');
        if (yValue) {
          y = parseFloat(yValue);
        }
      case 'absdimension':
        xValue = child.attributes.get('x');
        if (xValue != null) {
          const ndcx = parseFloat(xValue) / maxAspectCompensation;
          x = NDCtoDDCWidth(ndcx);
        }

        yValue = child.attributes.get('y');
        if (yValue != null) {
          const ndcy = parseFloat(yValue) / maxAspectCompensation;
          y = NDCtoDDCHeight(ndcy);
        }
      default:
        // TODO: Error handling
    }
  }

  return { x, y };
};
