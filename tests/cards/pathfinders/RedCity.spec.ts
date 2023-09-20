import {expect} from 'chai';
import {RedCity} from '../../../src/server/cards/pathfinders/RedCity';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Phase} from '../../../src/common/Phase';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {MarsBoard} from '../../../src/server/boards/MarsBoard';
import {Units} from '../../../src/common/Units';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast} from '../../TestingUtils';

describe('RedCity', function() {
  let card: RedCity;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;
  let board: MarsBoard;

  beforeEach(function() {
    card = new RedCity();
    [game, player, player2] = testGame(2, {pathfindersExpansion: true, turmoilExtension: true});
    turmoil = game.turmoil!;
    board = game.board;
  });

  it('can play', () => {
    game.phase = Phase.ACTION;
    player.megaCredits = card.cost;
    turmoil.rulingParty = turmoil.getPartyByName(PartyName.SCIENTISTS);
    player.production.override({energy: 1});

    expect(player.canPlay(card)).is.false;

    turmoil.rulingParty = turmoil.getPartyByName(PartyName.REDS);
    player.production.override({energy: 0});

    expect(player.canPlay(card)).is.false;

    player.production.override({energy: 1});
    turmoil.rulingParty = turmoil.getPartyByName(PartyName.REDS);

    expect(player.canPlay(card)).is.true;
  });

  it('cannot play when no spaces are available', () => {
    game.phase = Phase.ACTION;
    player.megaCredits = card.cost;
    player.production.override({energy: 1});
    turmoil.rulingParty = turmoil.getPartyByName(PartyName.REDS);
    expect(player.canPlay(card)).is.true;

    // An arbitrary space.
    const redCitySpace = board.getSpace('53');

    board.spaces.forEach((space) => {
      if (space.spaceType !== SpaceType.OCEAN) {
        if (space.id !== redCitySpace.id) {
          space.tile = {tileType: TileType.GREENERY};
        }
      }
    });

    // One space can hold a city.
    expect(board.getAvailableSpacesForCity(player)).has.members([redCitySpace]);
    // But it's surrounded by greenery, so Red City can't go there.
    expect(player.canPlay(card)).is.false;

    const adjacentSpaces = board.getAdjacentSpaces(redCitySpace);
    expect(adjacentSpaces).has.length(4);

    for (let idx = 1; idx < adjacentSpaces.length; idx++) {
      adjacentSpaces[idx].tile = undefined;
    }

    expect(player.canPlay(card)).is.false;

    adjacentSpaces[0].tile = undefined;
    expect(player.canPlay(card)).is.true;
  });

  it('play', function() {
    const redCitySpace = board.getSpace('53');
    player.production.override({energy: 1});
    const action = cast(card.play(player), SelectSpace);
    expect(player.production.asUnits()).deep.eq(Units.of({energy: 0, megacredits: 2}));
    expect(action.spaces).includes(redCitySpace);

    action.cb(redCitySpace);

    expect(redCitySpace.tile?.tileType).eq(TileType.RED_CITY);
    expect(redCitySpace.player).eq(player);
  });

  it('vps', function() {
    const redCitySpace = board.getSpace('53');
    player.production.override({energy: 1});
    cast(card.play(player), SelectSpace).cb(redCitySpace);

    expect(card.getVictoryPoints(player)).eq(4);

    const adjacentSpaces = board.getAdjacentSpaces(redCitySpace);
    adjacentSpaces[0].tile = {tileType: TileType.OCEAN};

    expect(card.getVictoryPoints(player)).eq(3);

    adjacentSpaces[1].tile = {tileType: TileType.CITY};

    expect(card.getVictoryPoints(player)).eq(2);

    adjacentSpaces[2].tile = {tileType: TileType.MOHOLE_AREA};
    expect(card.getVictoryPoints(player)).eq(1);
  });

  it('cannot place greenery next to red city', function() {
    const redCitySpace = board.getSpace('53');
    player.production.override({energy: 1});
    cast(card.play(player), SelectSpace).cb(redCitySpace);
    const adjacentSpaces = board.getAdjacentSpaces(redCitySpace);

    // Nobody may place a greenery next to Red City.
    board.getAvailableSpacesForGreenery(player).forEach((space) => {
      expect(adjacentSpaces).does.not.contain(space);
    });

    // Even other players.
    board.getAvailableSpacesForGreenery(player2).forEach((space) => {
      expect(adjacentSpaces).does.not.contain(space);
    });
  });
});
