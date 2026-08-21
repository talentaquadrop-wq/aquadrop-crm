const app = require("./index");

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 Aqua Drop Backend running on port ${PORT}`
  );
});