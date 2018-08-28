const isRealString = str => {
  return typeof str === 'string' && str.trim().length
};

module.exports = { isRealString };