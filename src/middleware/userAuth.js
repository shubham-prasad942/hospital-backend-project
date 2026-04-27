const userSchema = require("../Model/UserSchema");
const ApiErr = require("./ApiErr");
const jwt = require("jsonwebtoken");

const isAdminAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw new ApiErr(400, "Admin is not authorized");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decoded) {
    throw new ApiErr(400, "Invalid token");
  }
  const admin = await userSchema.findById(decoded.id);
  if (!admin || admin.role !== "admin") {
    throw new ApiErr(403, "You are not authorized as admin");
  }
  req.user = admin;
  next();
};

const isPatientAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw new ApiErr(400, "Patient is not authorized");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decoded) {
    throw new ApiErr(400, "Invalid token");
  }
  const user = await userSchema.findById(decoded.id);
  if (!user || user.role !== "patient") {
    throw new ApiErr(403, "You are not authorized as user");
  }
  req.user = user;
  next();
};

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      throw new ApiErr(401, "User is not authenticated");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      throw new ApiErr(401, "Invalid token");
    }
    const user = await userSchema.findById(decoded.id);
    if (!user) {
      throw new ApiErr(404, "User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isAdminAuthenticated,
  isPatientAuthenticated,
  isAuthenticated,
};
