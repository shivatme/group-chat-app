import { createServer } from "./server";

const PORT = Number(process.env.PORT) || 3005;
const HOST = "0.0.0.0";
const server = createServer();

server.listen(PORT, HOST, () => {
  console.log(`Server running on:`);
  console.log(`Local:   http://localhost:${PORT}`);
});
