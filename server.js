require("dotenv").config();
const connectDb = require("./src/Db/db");
const app = require("./src/app");
connectDb();
app.listen(process.env.PORT, () => {
  console.log(`app is listing on port ${process.env.PORT}`);
});
