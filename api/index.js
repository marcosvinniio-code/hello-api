const packageJson = require("../package.json");

module.exports = function handler(request, response) {
  if (request.url === "/") {
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.status(200).send("Hello, World!");
  } else if (request.url === "/health") {
    response.setHeader("Content-Type", "application/json");
    response.status(200).send(JSON.stringify({
      status: "ok",
      version: packageJson.version
    }));
  } else {
    response.setHeader("Content-Type", "application/json");
    response.status(404).send(JSON.stringify({ error: "not_found", path: request.url }));
  }
};