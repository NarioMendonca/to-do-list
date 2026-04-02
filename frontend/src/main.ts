import { homePageHTML } from "./ui/pages/Home";

const rootDiv = document.getElementById("app");
if (rootDiv == null) {
  throw new Error("Root div not found in index.html");
}
rootDiv.innerHTML = homePageHTML;
