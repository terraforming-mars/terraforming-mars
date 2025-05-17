export enum AgendaStyle {
  STANDARD = 'Standard',
  RANDOM = 'Random',
  CHAIRMAN = 'Chairman',
}

const BONUS_PARTIES = ['m', 's', 'u', 'k', 'r', 'g'] as const;
const BONUS_SUFFIXES = ['b01', 'b02'] as const;

type BonusParty = typeof BONUS_PARTIES[number];
type BonusSuffix = typeof BONUS_SUFFIXES[number]

// TODO(kberg): this should match BONUS_PARTIES
const POLICY_PARTIES = ['mf', 's', 'u', 'k', 'r', 'g'] as const;
const POLICY_SUFFIXES = ['p01', 'p02', 'p03', 'p04'] as const;
type PolicyParty = typeof POLICY_PARTIES[number];
type PolicySuffix = typeof POLICY_SUFFIXES[number];

export type BonusId = `${BonusParty}${BonusSuffix}`;
export type PolicyId = `${PolicyParty}${PolicySuffix}`

export type Agenda = {
  bonusId: BonusId;
  policyId: PolicyId;
}

export const BONUS_IDS: ReadonlyArray<BonusId> = BONUS_PARTIES.flatMap((p) => BONUS_SUFFIXES.map((s) => `${p}${s}` as BonusId));
export const POLICY_IDS: ReadonlyArray<PolicyId> = POLICY_PARTIES.flatMap((p) => POLICY_SUFFIXES.map((s) => `${p}${s}` as PolicyId));
