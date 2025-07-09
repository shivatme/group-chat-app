import { createServer } from "./server";

const PORT = process.env.PORT || 3000;
const server = createServer();

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
