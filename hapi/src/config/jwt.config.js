module.exports = {
  algo: process.env.HAPI_JWT_ALGO,
  secret: process.env.HAPI_JWT_SECRET,
  iss: process.env.HAPI_JWT_ISS,
  ttl: process.env.HAPI_JWT_TTL_SEC,
  maxTtl: process.env.HAPI_JWT_MAX_TTL_SEC
}
