export interface ParsedConformityError {
  severity: 'WARNING' | 'DANGER';
  parameter: string;
  peptide: string;
  delta: string;
}

// Known QCloud parameter names that can appear as the trailing part of the message.
// Extend this list if QCloud starts flagging other parameters.
const KNOWN_PARAMETERS = ['Retention time', 'Peak area', 'Median IT'];

const CONFORMITY_PATTERN = new RegExp(
  `^(WARNING|DANGER):\\s*(-?[0-9.]+)\\s*in\\s*(.+?)\\s+(${KNOWN_PARAMETERS.join('|')})$`
);

// Peptide sequences start with a run of uppercase amino-acid letters (e.g. "HLVDEPQNLIK",
// or "SLHTLFGDELC(Carbamidomethyl)K" once a modification annotation is appended); other
// entities (e.g. "Median IT MS1") are instrument metric names, in Title Case, and shouldn't
// be truncated.
const PEPTIDE_SEQUENCE_START_PATTERN = /^[A-Z]{3,}/;

export function parseConformityError(error: string): ParsedConformityError | null {
  const match = error.match(CONFORMITY_PATTERN);
  if (!match) {
    return null;
  }
  return {
    severity: match[1] as 'WARNING' | 'DANGER',
    delta: match[2],
    peptide: match[3],
    parameter: match[4],
  };
}

function shortenEntity(entity: string): string {
  return PEPTIDE_SEQUENCE_START_PATTERN.test(entity) ? entity.slice(0, 3) : entity;
}

// includeIcon should be false when the caller already shows one severity icon per file
// (e.g. the non-conformities dialog) — otherwise every line gets its own redundant dot.
export function formatConformitySummary(error: string, includeIcon = true): string {
  const parsed = parseConformityError(error);
  if (!parsed) {
    return error;
  }
  const text = `${parsed.parameter} — ${shortenEntity(parsed.peptide)}`;
  if (!includeIcon) {
    return text;
  }
  const icon = parsed.severity === 'DANGER' ? '🔴' : '⚠️';
  return `${icon} ${text}`;
}

export function formatConformityErrorsForTooltip(errors: string[]): string {
  if (!errors || errors.length === 0) {
    return '';
  }
  return errors.map(error => formatConformitySummary(error)).join('\n');
}
