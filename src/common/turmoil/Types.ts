export enum AgendaStyle {
  STANDARD = 'Standard',
  RANDOM = 'Random',
  CHAIRMAN = 'Chairman',
}

const PARTIES = ['m', 's', 'u', 'k', 'r', 'g'] as const;
const BONUS_SUFFIXES = ['b01', 'b02'] as const;
const POLICY_SUFFIXES = ['p01', 'p02', 'p03', 'p04'] as const;

type Party = typeof PARTIES[number];
type BonusSuffix = typeof BONUS_SUFFIXES[number]
type PolicySuffix = typeof POLICY_SUFFIXES[number];

export type BonusId = `${Party}${BonusSuffix}`;
export type PolicyId = `${Party}${PolicySuffix}`

export type Agenda = {
  bonusId: BonusId;
  policyId: PolicyId;
}

export const BONUS_IDS: ReadonlyArray<BonusId> = PARTIES.flatMap((p) => BONUS_SUFFIXES.map((s) => `${p}${s}` as BonusId));
export const POLICY_IDS: ReadonlyArray<PolicyId> = PARTIES.flatMap((p) => POLICY_SUFFIXES.map((s) => `${p}${s}` as PolicyId));
