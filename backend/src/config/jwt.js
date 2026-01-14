module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET
};
