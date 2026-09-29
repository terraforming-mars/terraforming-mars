import * as constants from '@/common/constants';

import {CardName} from '../cards/CardName';
import {ColonyName} from '../colonies/ColonyName';
import {hasNegativeEscapeVelocityOption} from './escapeVelocity';
import {NewGameConfig} from './NewGameConfig';
import {Expansion} from '../cards/GameModule';
import {Message} from '../logs/Message';
import {LogMessageDataType} from '../logs/LogMessageDataType';

const REVISED_COUNT_ALGORITHM = false;

export type ValidationErrors = {
  negativeEscapeVelocity: boolean;
  notEnoughColonies: number;
  notEnoughCeos: number;
  notEnoughPreludes: number;

  maybeNotEnoughPreludes: Array<CardName>;
  coloniesMissingExpansions: Array<ColonyName>;
  corporationsMissingExpansions: Array<CardName>;
  preludesMissingExpansions: Array<CardName>;
  ceosMissingExpansions: Array<CardName>;
  soloWithoutCorporateEra: boolean;
  infiniteEnergyBug: boolean;
  notEnoughCorporations: number;
};

function mustSelectAtLeast(message: string, required: number): Message {
  return {
    message,
    data: [{type: LogMessageDataType.RAW_STRING, value: String(required)}],
  };
}

export const validationDetails: Record<keyof ValidationErrors, {blocking: boolean, message: string | ((errors: ValidationErrors) => Message)}> = {
  negativeEscapeVelocity: {
    blocking: true,
    message: 'Escape Velocity values cannot be negative.',
  },
  notEnoughColonies: {
    blocking: true,
    message: (errors) => mustSelectAtLeast('Must select at least ${0} colonies', errors.notEnoughColonies),
  },
  notEnoughCeos: {
    blocking: true,
    message: (errors) => mustSelectAtLeast('Must select at least ${0} CEOs', errors.notEnoughCeos),
  },
  notEnoughPreludes: {
    blocking: true,
    message: (errors) => mustSelectAtLeast('Must select at least ${0} Preludes', errors.notEnoughPreludes),
  },
  maybeNotEnoughPreludes: {
    blocking: false,
    message: 'These cards draw extra preludes, so your custom Preludes list may run out.',
  },
  coloniesMissingExpansions: {
    blocking: false,
    message: 'Some of the colonies you selected need expansions you have not enabled. Using them might break your game.',
  },
  corporationsMissingExpansions: {
    blocking: false,
    message: 'Some of the corps you selected need expansions you have not enabled. Using them might break your game.',
  },
  preludesMissingExpansions: {
    blocking: false,
    message: 'Some of the Preludes you selected need expansions you have not enabled. Using them might break your game.',
  },
  ceosMissingExpansions: {
    blocking: false,
    message: 'Some of the CEOs you selected need expansions you have not enabled. Using them might break your game.',
  },
  soloWithoutCorporateEra: {
    blocking: false,
    message: 'We do not recommend playing a solo game without the Corporate Era.',
  },
  infiniteEnergyBug: {
    blocking: false,
    message: 'It is possible with ThorGate, Standard Technology, Suitable Infrastructure, and High Temp. Superconductors for a player to have infinite energy production.',
  },
  notEnoughCorporations: {
    blocking: true,
    message: (errors) => mustSelectAtLeast('Must select at least ${0} corporations', errors.notEnoughCorporations),
  },
};

export type Helpers = {
  getCardCompatibility: (name: CardName) => ReadonlyArray<Expansion>,
  getColonyExpansion: (name: ColonyName) => Expansion | undefined,
};

export function validateNewGameConfig(config: NewGameConfig, helpers: Helpers): ValidationErrors {
  const playerCount = config.players.length;
  const errors: ValidationErrors = {
    coloniesMissingExpansions: [],
    corporationsMissingExpansions: [],
    preludesMissingExpansions: [],
    ceosMissingExpansions: [],
    negativeEscapeVelocity: false,
    notEnoughColonies: 0,
    notEnoughCeos: 0,
    notEnoughPreludes: 0,
    maybeNotEnoughPreludes: [],
    soloWithoutCorporateEra: false,
    infiniteEnergyBug: false,
    notEnoughCorporations: 0,
  };

  if (config.escapeVelocity && hasNegativeEscapeVelocityOption(config.escapeVelocity)) {
    errors.negativeEscapeVelocity = true;
  }

  // Check custom colony count
  if (config.customColoniesList.length > 0) {
    let required = playerCount + 2;
    if (playerCount === 1) {
      required = 4;
    } else if (playerCount === 2) {
      required = 5;
    }

    if (config.customColoniesList.length < required) {
      errors.notEnoughColonies = required;
    }
    errors.coloniesMissingExpansions = config.customColoniesList.filter((colonyName) => {
      const expansion = helpers.getColonyExpansion(colonyName);
      return expansion !== undefined && !config.expansions[expansion];
    });
  }

  if (playerCount === 1 && config.expansions.corpera === false) {
    errors.soloWithoutCorporateEra = true;
  }

  if (isInfiniteEnergyBug(config)) {
    errors.infiniteEnergyBug = true;
  }

  function isMissingExpansion(name: CardName): boolean {
    for (const module of helpers.getCardCompatibility(name)) {
      if (!config.expansions[module]) {
        return true;
      }
    }
    return false;
  }

  // Check custom corp count
  if (config.customCorporationsList.length > 0) {
    let required = playerCount * config.startingCorporations;
    if (REVISED_COUNT_ALGORITHM) {
      if (config.twoCorpsVariant) {
        // Add an additional 4 for the Merger prelude
        // Everyone-Merger needs an additional 4 corps per player
        //  NB: This will not cover the case when no custom corp list is set!
        //  It _can_ come about if  the number of corps included in all expansions is still not enough.
        required = (playerCount * config.startingCorporations) + (playerCount * 4);
      } else {
        required = playerCount * config.startingCorporations;
        // Merger Prelude alone needs 4 additional preludes
        if (config.expansions.prelude && config.expansions.promo) {
          required += 4;
        }
      }
    }
    if (config.customCorporationsList.length < required) {
      errors.notEnoughCorporations = required;
    }
    errors.corporationsMissingExpansions = config.customCorporationsList.filter(isMissingExpansion);
  }

  if (config.customPreludes.length > 0) {
    const required = playerCount * config.startingPreludes;
    if (config.customPreludes.length < required) {
      errors.notEnoughPreludes = required;
    }
    errors.preludesMissingExpansions = config.customPreludes.filter(isMissingExpansion);
    errors.maybeNotEnoughPreludes = preludeDrawingCards(config);
  }

  // Check custom CEO count. The server deals at least CEO_CARDS_DEALT_PER_PLAYER CEOs to each player.
  if (config.customCeos.length > 0) {
    const required = playerCount * Math.max(config.startingCeos, constants.CEO_CARDS_DEALT_PER_PLAYER);
    if (config.customCeos.length < required) {
      errors.notEnoughCeos = required;
    }
    errors.ceosMissingExpansions = config.customCeos.filter(isMissingExpansion);
  }
  return errors;
}

/**
 * Cards that draw from the prelude deck and might be in this game.
 */
function preludeDrawingCards(config: NewGameConfig): Array<CardName> {
  const cards: Array<CardName> = [];
  if (config.customCorporationsList.length === 0 || config.customCorporationsList.includes(CardName.VALLEY_TRUST)) {
    cards.push(CardName.VALLEY_TRUST);
  }
  if (config.customPreludes.includes(CardName.NEW_PARTNER)) {
    cards.push(CardName.NEW_PARTNER);
  }
  if (config.customPreludes.includes(CardName.BOARD_OF_DIRECTORS)) {
    cards.push(CardName.BOARD_OF_DIRECTORS);
  }
  if (config.expansions.turmoil) {
    if (config.expansions.prelude2 || config.includedCards.includes(CardName.WG_PROJECT)) {
      if (!config.bannedCards.includes(CardName.WG_PROJECT)) {
        cards.push(CardName.WG_PROJECT);
      }
    }
  }
  if (config.expansions.ceo) {
    if (config.customCeos.length === 0 || config.customCeos.includes(CardName.KAREN)) {
      cards.push(CardName.KAREN);
    }
  }
  return cards;
}

function isInfiniteEnergyBug(config: NewGameConfig) {
  // Check Prelude 2 + Pathfinders infinite energy production
  if (config.customCorporationsList.length > 0 && !config.customCorporationsList.includes(CardName.THORGATE)) {
    return false;
  }
  if (config.bannedCards.includes(CardName.STANDARD_TECHNOLOGY)) {
    return false;
  }

  if (config.bannedCards.includes(CardName.SUITABLE_INFRASTRUCTURE)) {
    return false;
  }

  if (config.expansions.prelude2 === false && !config.includedCards.includes(CardName.SUITABLE_INFRASTRUCTURE)) {
    return false;
  }

  if (config.bannedCards.includes(CardName.HIGH_TEMP_SUPERCONDUCTORS)) {
    return false;
  }
  if (config.expansions.pathfinders === false && !config.includedCards.includes(CardName.HIGH_TEMP_SUPERCONDUCTORS)) {
    return false;
  }

  return true;
}
