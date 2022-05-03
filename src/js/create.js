export default function create(el, classNames, child, parent, dataAttr) {
  const element = document.createElement(el);
  if (classNames) element.classList.add(...classNames.split(' '));

  if (child && Array.isArray(child)) {
    child.forEach((e) => element.append(e));
  } else if (typeof child === 'string') {
    element.innerHTML = child;
  } else {
    element.append(child);
  }

  if (parent) {
    parent.append(element);
  }

  if (dataAttr.length) {
    dataAttr.forEach(([attrName, attrValue]) => {
      if (attrName.match(/value|id|placeholder|cols|rows|autocorrect|spellcheck/)) {
        element.setAttribute(attrName, attrValue);
      } else {
        element.dataset[attrName] = attrValue;
      }
    });
  }
  return element;
}
