import { server } from "./server.js";
import env from "../env/getEnvs.js";

if (env.NODE_ENV !== "test") {
  const PORT = process.env.PORT;
  server.listen(PORT, () => {
    const serverAddress = server.getAddress();
    console.log(
      `Server running on ${serverAddress?.address ?? ""}:${serverAddress?.port}`,
    );
  });
}

export default server;
