const packageJson = require("../package.json");

module.exports = function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).send("Method Not Allowed");
    return;
  }

  if (request.url === "/") {
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.status(200).send("Olá, Mundo!");
  } else if (request.url === "/health") {
    response.setHeader("Content-Type", "application/json");
    response.status(200).send(
      JSON.stringify({
        status: "ok",
        version: packageJson.version,
        commit: process.env.COMMIT_SHA || "local",
        timestamp: new Date().toISOString(),
        environment: process.env.VERCEL_ENV || "development",
      }),
    );
  } else {
    response.setHeader("Content-Type", "application/json");
    response
      .status(404)
      .send(JSON.stringify({ error: "not_found", path: request.url }));
  }
};
