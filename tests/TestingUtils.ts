import {Player} from '../src/Player';
import {Game, GameOptions} from '../src/Game';
import * as constants from '../src/constants';
import {SpaceType} from '../src/SpaceType';
import {BoardName} from '../src/BoardName';
import {RandomMAOptionType} from '../src/RandomMAOptionType';
import {ISpace} from '../src/ISpace';

// Returns the oceans created during this operation which may not reflect all oceans.
export const maxOutOceans = function(player: Player, game: Game, toValue: number = 0): Array<ISpace> {
  const oceans = [];
  if (toValue < 1) {
    toValue = constants.MAX_OCEAN_TILES;
  }

  for (const space of game.board.getSpaces(SpaceType.OCEAN, player)) {
    if (space.tile !== undefined) continue;
    if (game.board.getOceansOnBoard() >= toValue) break;
    game.addOceanTile(player, space.id);
    oceans.push(space);
  }
  return oceans;
};

export const resetBoard = function(game: Game): void {
  game.board.spaces.forEach((space) => {
    space.player = undefined;
    space.tile = undefined;
  });
};

export const setCustomGameOptions = function(options: object = {}): GameOptions {
  const defaultOptions = {
    draftVariant: false,
    initialDraftVariant: false,
    corporateEra: true,
    randomMA: RandomMAOptionType.NONE,
    preludeExtension: false,
    venusNextExtension: true,
    coloniesExtension: false,
    turmoilExtension: true,
    boardName: BoardName.ORIGINAL,
    showOtherPlayersVP: false,
    customCorporationsList: [],
    solarPhaseOption: false,
    shuffleMapOption: false,
    promoCardsOption: false,
    communityCardsOption: false,
    undoOption: false,
    startingCorporations: 2,
    includeVenusMA: true,
    soloTR: false,
    clonedGamedId: undefined,
    cardsBlackList: [],
    aresExtension: false,
    aresHazards: false,
    fastModeOption: false,
    removeNegativeGlobalEventsOption: false,
    customColoniesList: [],
    requiresVenusTrackCompletion: false,
  };

  return Object.assign(defaultOptions, options);
};
