export function getPathPatternSegments(pathPattern: string) {
  const PATH_PATTERN_SEGMENTS_REGEX = /\/:?\w*/g;
  const pathPatternSegments = pathPattern.match(PATH_PATTERN_SEGMENTS_REGEX);
  return pathPatternSegments;
}
