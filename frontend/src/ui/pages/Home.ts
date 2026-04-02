import { layoutWithSideBarHtml } from "../layouts/layoutWithSideBar";
import { sideBarHtml } from "../components/sideBar";
import { todayTodosHtml } from "../components/todayTodos";

export const homePageHTML = layoutWithSideBarHtml(sideBarHtml, todayTodosHtml);
