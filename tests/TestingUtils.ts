import {Player} from '../src/Player';
import {Game, GameOptions} from '../src/Game';
import * as constants from '../src/constants';
import {SpaceType} from '../src/SpaceType';
import {BoardName} from '../src/boards/BoardName';
import {RandomMAOptionType} from '../src/RandomMAOptionType';
import {ISpace} from '../src/boards/ISpace';
import {Color} from '../src/Color';
import {AgendaStyle} from '../src/turmoil/PoliticalAgendas';
import {Phase} from '../src/Phase';
import {IParty} from '../src/turmoil/parties/IParty';
import {Turmoil} from '../src/turmoil/Turmoil';
import {TurmoilPolicy} from '../src/turmoil/TurmoilPolicy';
import {TestPlayer} from './TestPlayer';

// Returns the oceans created during this operation which may not reflect all oceans.
export const maxOutOceans = function(player: Player, toValue: number = 0): Array<ISpace> {
  const oceans = [];
  if (toValue < 1) {
    toValue = constants.MAX_OCEAN_TILES;
  }

  for (const space of player.game.board.getSpaces(SpaceType.OCEAN, player)) {
    if (space.tile !== undefined) continue;
    if (player.game.board.getOceansOnBoard() >= toValue) break;
    player.game.addOceanTile(player, space.id);
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
    showTimers: false,
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
    politicalAgendasExtension: AgendaStyle.STANDARD,
    moonExpansion: false,
  };

  return Object.assign(defaultOptions, options);
};

export const setRulingPartyAndRulingPolicy = function(game: Game, turmoil: Turmoil, party: IParty, policyId: TurmoilPolicy) {
  turmoil.rulingParty = party;
  turmoil.politicalAgendasData.currentAgenda = {bonusId: party.bonuses[0].id, policyId: policyId};
  game.phase = Phase.ACTION;
};

// This could be moved to TestPlayer.ts, but that would require HUNDREDS of updates.
// So, someone do that sometime soon, please.
class TestPlayerFactory {
  constructor(private color: Color) {}
  newPlayer(): TestPlayer {
    return new TestPlayer(this.color);
  }
}

// Prefer these players when testing, as their IDs are easy to recognize in output.
export class TestPlayers {
  public static BLUE: TestPlayerFactory = new TestPlayerFactory(Color.BLUE);
  public static RED: TestPlayerFactory = new TestPlayerFactory(Color.RED);
  public static YELLOW: TestPlayerFactory = new TestPlayerFactory(Color.YELLOW);
  public static GREEN: TestPlayerFactory = new TestPlayerFactory(Color.GREEN);
  public static BLACK: TestPlayerFactory = new TestPlayerFactory(Color.BLACK);
  public static PURPLE: TestPlayerFactory = new TestPlayerFactory(Color.PURPLE);
}
