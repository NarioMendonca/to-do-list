import { AddressInfo } from "net";
import { server } from "./server.js";
import env from "../env/getEnvs.js";

if (env.NODE_ENV !== "test") {
  const PORT = process.env.PORT;
  server.listen(PORT, () => {
    const serverAdress = server.address() as AddressInfo;
    console.log(
      `Server running on ${serverAdress.address}:${serverAdress.port}`,
    );
  });
}

export default server;
