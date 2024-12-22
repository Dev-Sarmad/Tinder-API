const validateProfileEdits = (req) => {
  const allowedEntities = ["age", "gender", "password", "skills", "about"];
  const isAllowed = Object.keys(req.body).every((field) =>
    allowedEntities.includes(field)
  );
  return isAllowed;
};

module.exports = validateProfileEdits;
