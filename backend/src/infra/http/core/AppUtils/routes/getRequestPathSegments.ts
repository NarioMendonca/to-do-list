export function getRequestPathSegments(requestPath: string) {
  //(\/[^\/]+)(\/[^\/]+)?
  const GET_ROUTE_ELEMENTS_REGEX = /\/[^\/]*/g;
  const searchedPath = requestPath.match(GET_ROUTE_ELEMENTS_REGEX);
  return searchedPath;
}
