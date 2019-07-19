/* eslint-disable import/prefer-default-export */

export const extractDimensionsFrom = (node) => {
  let x;
  let y;

  const xValue = node.attributes.get('x');
  if (xValue !== null) {
    // TODO: Aspect ratio conversions++
    x = parseFloat(xValue);
  }

  const yValue = node.attributes.get('y');
  if (yValue !== null) {
    // TODO: Aspect ratio conversions++
    y = parseFloat(yValue);
  }

  const child = node.firstChild;
  if (!child) {
    if (y) return { x, y };
    return null;
  }

  const iname = child.name.toLowerCase();
  switch (iname) {
    case 'reldimension':
      console.error('TODO: RelDimension for', node);
      break;
    case 'absdimension':
      console.error('TODO: AbsDimension for', node);
      break;
    default:
      // TODO: Error handling
      return null;
  }
};
