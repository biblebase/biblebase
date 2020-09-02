function isEmptyObject(obj) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }
  return true;
}

export { isEmptyObject };