import http from "http";

// Overwrite this with a function that returns true if the project is ready
let callback: () => boolean = () => false;

export const registerCallback = (cb: () => boolean) => {
  callback = cb;
  return cb();
};

if (process.env.ENABLE_HEALTHCHECK === "true") {
  const server = http.createServer((req, res) => {
    res.writeHead(callback() === true ? 200 : 500);
    res.end();
  });

  server.listen(80);
}
