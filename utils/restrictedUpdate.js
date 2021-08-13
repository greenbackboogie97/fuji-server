module.exports = restrictedUpdate = (body, ...allowedFields) => {
  Object.entries(body).forEach(([key, value], index) => {
    if (!allowedFields.includes(key)) {
      delete body[key];
    }
  });
  return body;
};
