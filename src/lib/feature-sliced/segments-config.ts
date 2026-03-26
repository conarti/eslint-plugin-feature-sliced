import type { SegmentsConfig } from '../../config';
import { DEFAULT_SEGMENTS } from '../../config';

/**
 * Normalizes segments configuration.
 * - If no config provided, returns DEFAULT_SEGMENTS
 * - If array provided (extend mode), adds custom segments to defaults
 * - If object with replace provided, uses only specified segments
 */
export function normalizeSegmentsConfig(config?: SegmentsConfig): string[] {
  if (!config) {
    return [...DEFAULT_SEGMENTS];
  }

  if (Array.isArray(config)) {
    const customSegments = config.map((s) => s.toLowerCase());
    const combined = [...DEFAULT_SEGMENTS, ...customSegments];
    return [...new Set(combined)];
  }

  const replacedSegments = config.replace.map((s) => s.toLowerCase());
  return [...new Set(replacedSegments)];
}

/**
 * Checks if the given string is a known segment
 */
export function isKnownSegment(segment: unknown, segments: string[]): boolean {
  if (typeof segment !== 'string' || segment === '') {
    return false;
  }

  return segments.includes(segment.toLowerCase());
}
