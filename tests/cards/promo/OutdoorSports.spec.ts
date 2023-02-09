import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {OutdoorSports} from '../../../src/server/cards/promo/OutdoorSports';
import {TestPlayer} from '../../TestPlayer';
import {ISpace} from '../../../src/server/boards/ISpace';

describe('OutdoorSports', function() {
  let card: OutdoorSports;
  let player: TestPlayer;
  let player2: TestPlayer;
  let oceanSpace: ISpace;
  let spaceNextToOcean: ISpace;
  let spaceNotNextToOcean: ISpace;
  beforeEach(function() {
    card = new OutdoorSports();
    const game = newTestGame(2);
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    const board = player.game.board;
    oceanSpace = board.getAvailableSpacesForOcean(player)[0];

    const spacesNextToOceanSpace = board.getAdjacentSpaces(oceanSpace);
    const citySpaces = board.getAvailableSpacesForCity(player);
    spaceNextToOcean = citySpaces.filter((space) => spacesNextToOceanSpace.includes(space))[0];
    spaceNotNextToOcean = citySpaces.filter((space) => !spacesNextToOceanSpace.includes(space))[0];
  });

  it('cannotPlay', function() {
    player.megaCredits = card.cost;
    player.game.addOceanTile(player, oceanSpace);
    expect(player.canPlay(card)).is.not.true;

    player.game.addCityTile(player, spaceNotNextToOcean);
    expect(player.canPlay(card)).is.not.true;
  });

  it('canPlay', function() {
    player.megaCredits = card.cost;
    player.game.addOceanTile(player, oceanSpace);
    expect(player.canPlay(card)).is.not.true;

    player.game.addCityTile(player, spaceNextToOcean);
    expect(player.canPlay(card)).is.true;
  });

  it('canPlay - other player owns the city', function() {
    player.megaCredits = card.cost;
    player.game.addOceanTile(player, oceanSpace);
    expect(player.canPlay(card)).is.not.true;

    player.game.addCityTile(player2, spaceNextToOcean);
    expect(player.canPlay(card)).is.true;
  });

  it('play', function() {
    expect(player.production.megacredits).to.eq(0);

    card.play(player);

    expect(player.production.megacredits).to.eq(2);
  });
});
