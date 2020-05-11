/* eslint-disable import/prefer-default-export */

import {
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
    y = NDCtoDDCWidth(ndcy);
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
          y = NDCtoDDCWidth(ndcy);
        }
      default:
        // TODO: Error handling
    }
  }

  return { x, y };
};

export const extractInsetsFrom = (node) => {
  let left = undefined;
  let right = undefined;
  let top = undefined;
  let bottom = undefined;

  let leftValue = node.attributes.get('left');
  if (leftValue) {
    const ndcl = parseFloat(leftValue) / maxAspectCompensation;
    left = NDCtoDDCWidth(ndcl);
  }

  let rightValue = node.attributes.get('right');
  if (rightValue) {
    const ndcr = parseFloat(rightValue) / maxAspectCompensation;
    right = NDCtoDDCWidth(ndcr);
  }

  let topValue = node.attributes.get('top');
  if (topValue) {
    const ndct = parseFloat(topValue) / maxAspectCompensation;
    top = NDCtoDDCWidth(ndct);
  }

  let bottomValue = node.attributes.get('bottom');
  if (bottomValue) {
    const ndcb = parseFloat(bottomValue) / maxAspectCompensation;
    bottom = NDCtoDDCWidth(ndcb);
  }

  const child = node.firstChild;
  if (!child) {
    if (!bottomValue) {
      // TODO: Error handling
    }
    return { left, right, top, bottom };
  }

  const iname = child.name.toLowerCase();
  switch (iname) {
    case 'absinset':
      leftValue = child.attributes.get('left');
      if (leftValue) {
        const ndcl = parseFloat(leftValue) / maxAspectCompensation;
        left = NDCtoDDCWidth(ndcl);
      }

      rightValue = child.attributes.get('right');
      if (rightValue) {
        const ndcr = parseFloat(rightValue) / maxAspectCompensation;
        right = NDCtoDDCWidth(ndcr);
      }

      topValue = child.attributes.get('top');
      if (topValue) {
        const ndct = parseFloat(topValue) / maxAspectCompensation;
        top = NDCtoDDCWidth(ndct);
      }

      bottomValue = child.attributes.get('bottom');
      if (bottomValue) {
        const ndcb = parseFloat(bottomValue) / maxAspectCompensation;
        bottom = NDCtoDDCWidth(ndcb);
      }
      break;
    case 'relinset':
      leftValue = child.attributes.get('left');
      if (leftValue) {
        left = parseFloat(leftValue);
      }

      rightValue = child.attributes.get('right');
      if (rightValue) {
        right = parseFloat(rightValue);
      }

      topValue = child.attributes.get('top');
      if (topValue) {
        top = parseFloat(topValue);
      }

      bottomValue = child.attributes.get('bottom');
      if (bottomValue) {
        bottom = parseFloat(bottomValue);
      }
      break;
    default:
      // TODO: Error handling
      break;
  }
  return { left, right, top, bottom };
};

export const extractValueFrom = (node) => {
  let value = undefined;

  let val = node.attributes.get('val');
  if (val) {
    const ndc = parseFloat(val) / maxAspectCompensation;
    value = NDCtoDDCWidth(ndc);
  }

  const child = node.firstChild;
  if (!child) {
    if (!val) {
      // TODO: Error handling
    }
    return value;
  }

  const iname = child.name.toLowerCase();
  switch (iname) {
    case 'absvalue':
      val = child.attributes.get('val');
      if (val) {
        const ndc = parseFloat(val) / maxAspectCompensation;
        value = NDCtoDDCWidth(ndc);
      }
      break;
    case 'relvalue':
      val = child.attributes.get('val');
      if (val) {
        value = parseFloat(val);
      }
      break;
    default:
      // TODO: Error handling
      break;
  }

  return value;
};
