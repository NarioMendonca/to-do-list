import { AddressInfo } from "net";
import { server } from "./server.js";

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT;
  server.listen(PORT, () => {
    const serverAdress = server.address() as AddressInfo;
    console.log(
      `Server running on ${serverAdress.address}:${serverAdress.port}`,
    );
  });
}
