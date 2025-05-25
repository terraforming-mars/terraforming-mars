import {PartyName} from './PartyName';

export type AgendaStyle =
  /** Use the standard policies and bonuses. */
  'Standard' |
  /** Randomly choose policies and bonuses, which remain for the entire game. */
  'Random' |
  /** The incoming chairman sets the incoming policy and bonus each generation. */
  'Chairman';

const PARTIES = ['m', 's', 'u', 'k', 'r', 'g'] as const;
const BONUS_SUFFIXES = ['b01', 'b02'] as const;
const POLICY_SUFFIXES = ['p01', 'p02', 'p03', 'p04'] as const;

type Party = typeof PARTIES[number];
type BonusSuffix = typeof BONUS_SUFFIXES[number]
type PolicySuffix = typeof POLICY_SUFFIXES[number];

export type BonusId = `${Party}${BonusSuffix}`;
export type PolicyId = `${Party}${PolicySuffix}`

/* A party's policy (and ruling bonus). Can vary based on the agenda style. */
export type Agenda = {
  bonusId: BonusId;
  policyId: PolicyId;
}

export const BONUS_IDS: ReadonlyArray<BonusId> = PARTIES.flatMap((p) => BONUS_SUFFIXES.map((s) => `${p}${s}` as BonusId));
export const POLICY_IDS: ReadonlyArray<PolicyId> = PARTIES.flatMap((p) => POLICY_SUFFIXES.map((s) => `${p}${s}` as PolicyId));

/** When player has Mars Frontier Alliance, this is their political party alliance. */
export type AlliedParty = {
  partyName: PartyName;
  agenda: Agenda;
};
