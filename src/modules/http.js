const http = require("http");

const port = 8080;

const server = http.createServer((req, resp) => {
  if (req.url === "/home") {
    resp.writeHead(200, { "Content-Type": "text/html" }),
      resp.end("<h1>home page</h1>");
  }
  if (req.url === "/users") {
    const users = [
      {
        name: "John Doe",
        email: "john@doe.com",
      },
      {
        name: "Jane Doe",
        email: "jane@doe.com",
      },
    ];

    resp.writeHead(200, { "Content-Type": "application/json" });
    resp.end(JSON.stringify(users));
  }
});

server.listen(port, () => console.log(`Rodando na porta ${port}`));
