export function isPathPatternSegmentValid(segment: string) {
  const IS_SEGMENT_VALID_REGEX = /^\/:?\w*$/;
  return IS_SEGMENT_VALID_REGEX.test(segment);
}
