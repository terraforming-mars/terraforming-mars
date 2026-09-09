/**
 * Defaults for `NewGameConfig` fields not exposed in the Slack modal.
 *
 * Mirrors src/client/components/create/defaultCreateGameModel.ts in the
 * terraforming-mars repo. Keep in sync manually.
 */

import {
  DEFAULT_EXPANSIONS,
  NewGameConfig,
  NewPlayerModel,
} from './types.js';

export type PartialNewGameConfig =
  & Partial<NewGameConfig>
  & Pick<NewGameConfig, 'players'>;

/**
 * Fill in every required field with the same defaults the TM web form uses,
 * letting the caller override only the fields the Slack modal exposes.
 */
export function buildNewGameConfig(overrides: PartialNewGameConfig): NewGameConfig {
  const players: Array<NewPlayerModel> = overrides.players;

  return {
    players,
    expansions: overrides.expansions ?? {...DEFAULT_EXPANSIONS},
    board: overrides.board ?? 'tharsis',
    seed: overrides.seed ?? Math.random(),
    randomFirstPlayer: overrides.randomFirstPlayer ?? true,

    clonedGamedId: overrides.clonedGamedId,

    undoOption: overrides.undoOption ?? true,
    showTimers: overrides.showTimers ?? true,
    fastModeOption: overrides.fastModeOption ?? false,
    showOtherPlayersVP: overrides.showOtherPlayersVP ?? true,

    aresExtremeVariant: overrides.aresExtremeVariant ?? false,
    politicalAgendasExtension: overrides.politicalAgendasExtension ?? 'Standard',
    solarPhaseOption: overrides.solarPhaseOption ?? false,
    removeNegativeGlobalEventsOption: overrides.removeNegativeGlobalEventsOption ?? false,
    modularMA: overrides.modularMA ?? false,

    draftVariant: overrides.draftVariant ?? true,
    initialDraft: overrides.initialDraft ?? false,
    preludeDraftVariant: overrides.preludeDraftVariant ?? false,
    ceosDraftVariant: overrides.ceosDraftVariant ?? false,
    // Deliberately 3 rather than the web form's 2 - see issue #5.
    startingCorporations: overrides.startingCorporations ?? 3,
    shuffleMapOption: overrides.shuffleMapOption ?? false,
    randomMA: overrides.randomMA ?? 'Full random',
    includeFanMA: overrides.includeFanMA ?? true,
    soloTR: overrides.soloTR ?? false,
    customCorporationsList: overrides.customCorporationsList ?? [],
    bannedCards: overrides.bannedCards ?? [],
    includedCards: overrides.includedCards ?? [],
    customColoniesList: overrides.customColoniesList ?? [],
    customPreludes: overrides.customPreludes ?? [],
    requiresMoonTrackCompletion: overrides.requiresMoonTrackCompletion ?? false,
    requiresVenusTrackCompletion: overrides.requiresVenusTrackCompletion ?? false,
    moonStandardProjectVariant: overrides.moonStandardProjectVariant ?? false,
    moonStandardProjectVariant1: overrides.moonStandardProjectVariant1 ?? false,
    altVenusBoard: overrides.altVenusBoard ?? false,
    escapeVelocity: overrides.escapeVelocity,
    twoCorpsVariant: overrides.twoCorpsVariant ?? false,
    customCeos: overrides.customCeos ?? [],
    startingCeos: overrides.startingCeos ?? 3,
    startingPreludes: overrides.startingPreludes ?? 4,
  };
}
