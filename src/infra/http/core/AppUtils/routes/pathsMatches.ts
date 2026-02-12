import { isSegmentPathParam } from "./index.js";

type PathsMatchesOutput = {
  params: Record<string, string>;
} | null;

export function pathsMatches(
  routePath: string[],
  requestPathSegments: string[],
): PathsMatchesOutput {
  const params = {} as Record<string, string>;
  let isRouteFinded = true;
  for (const index in routePath) {
    const routeSegment = routePath[index];
    const requestSegment = requestPathSegments[index];
    if (
      routeSegment !== requestSegment &&
      !isSegmentPathParam(routeSegment) // when the segment is a param, the value is diff from route name
    ) {
      isRouteFinded = false;
      break;
    }

    if (isSegmentPathParam(routeSegment)) {
      params[routeSegment.slice(2)] = requestSegment.slice(1); // pick just the param name, ex: /:userId -> userId // remove the slash from param value
    }
  }
  if (!isRouteFinded) {
    return null;
  }
  return {
    params,
  };
}
