export enum AgendaStyle {
  STANDARD = 'Standard',
  RANDOM = 'Random',
  CHAIRMAN = 'Chairman',
}

type BonusParty = 'm' | 's' | 'u' | 'k' | 'r' | 'g';
type BonusSuffix = 'b01' | 'b02';
export type BonusId = `${BonusParty}${BonusSuffix}`;

type PolicyParty = 'mf' | 's' | 'u' | 'k' | 'r' | 'g';
type PolicySuffix = 'p01' | 'p02' | 'p03' | 'p04';
export type PolicyId = `${PolicyParty}${PolicySuffix}`

export type Agenda = {
  bonusId: BonusId;
  policyId: PolicyId;
}

