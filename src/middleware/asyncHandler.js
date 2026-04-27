const asyncWrapper = (reqHandler) => {
  return async (req, res, next) => {
    try {
      await reqHandler(req,res,next);
    } catch (err) {
     next(err)
    }
  };
};
module.exports = asyncWrapper;
