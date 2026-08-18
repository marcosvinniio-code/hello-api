const { test } = require("node:test");
const assert = require("node:assert");
const handler = require("../api/index.js");
function criarResponseFalso() {
  const response = {
    _status: null,
    _body: null,
    _headers: {},
    setHeader(nome, valor) {
      response._headers[nome] = valor;
    },
    status(codigo) {
      response._status = codigo;
      return response;
    },
    send(corpo) {
      response._body = corpo;
      return response;
    },
  };
  return response;
}
test("GET / retorna 200", () => {
  const request = { method: "GET", url: "/" };
  const response = criarResponseFalso();

  handler(request, response);

  assert.strictEqual(response._status, 200);
});

test("GET / retorna o corpo exato esperado", () => {
  const request = { method: "GET", url: "/" };
  const response = criarResponseFalso();

  handler(request, response);

  assert.strictEqual(response._body, "Hello, World!");
});

test("GET /health retorna 200 e Content-Type JSON", () => {
  const request = { method: "GET", url: "/health" };
  const response = criarResponseFalso();

  handler(request, response);

  assert.strictEqual(response._status, 200);
  assert.strictEqual(response._headers["Content-Type"], "application/json");
});

test("GET /health retorna todos os campos do contrato", () => {
  const request = { method: "GET", url: "/health" };
  const response = criarResponseFalso();

  handler(request, response);

  const corpo = JSON.parse(response._body);

  assert.strictEqual(corpo.status, "ok");
  assert.strictEqual(typeof corpo.version, "string");
  assert.strictEqual(typeof corpo.commit, "string");
  assert.strictEqual(typeof corpo.environment, "string");
  assert.strictEqual(typeof corpo.timestamp, "string");
});

test("Rota inexistente retorna 404", () => {
  const request = { method: "GET", url: "/rota-que-nao-existe" };
  const response = criarResponseFalso();

  handler(request, response);

  assert.strictEqual(response._status, 404);

  const corpo = JSON.parse(response._body);
  assert.strictEqual(corpo.error, "not_found");
});

test("POST / retorna 405 com header Allow", () => {
  const request = { method: "POST", url: "/" };
  const response = criarResponseFalso();

  handler(request, response);

  assert.strictEqual(response._status, 405);
  assert.strictEqual(response._headers["Allow"], "GET");
});
