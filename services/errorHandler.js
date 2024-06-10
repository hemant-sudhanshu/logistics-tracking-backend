export const handleBadRequest = (res, message) => {
  return res.status(400).json({
    success: false,
    message: message,
  });
};

export const handleUnauthorizedRequest = (res, message) => {
  return res.status(401).json({
    success: false,
    message: message,
  });
};

export const handleNotFoundRequest = (res, message) => {
  return res.status(404).json({
    success: false,
    message: message,
  });
};

export const handleInternalServerError = (res, error) => {
  return res.status(500).json({
    success: false,
    message: error.message,
  });
};
