import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {OutdoorSports} from '../../../src/server/cards/promo/OutdoorSports';
import {TestPlayer} from '../../TestPlayer';
import {Space} from '../../../src/server/boards/Space';
import {partition} from '../../../src/common/utils/utils';

describe('OutdoorSports', function() {
  let card: OutdoorSports;
  let player: TestPlayer;
  let player2: TestPlayer;
  let oceanSpace: Space;
  let spaceNextToOcean: Space;
  let spaceNotNextToOcean: Space;

  beforeEach(function() {
    card = new OutdoorSports();
    [/* skipped */, player, player2] = testGame(2);
    const board = player.game.board;
    oceanSpace = board.getAvailableSpacesForOcean(player)[0];

    const spacesNextToOceanSpace = board.getAdjacentSpaces(oceanSpace);
    const citySpaces = board.getAvailableSpacesForCity(player);
    [[spaceNextToOcean], [spaceNotNextToOcean]] = partition(
      citySpaces,
      (space) => spacesNextToOceanSpace.includes(space),
    );
  });

  it('cannotPlay', function() {
    player.megaCredits = card.cost;
    player.game.addOcean(player, oceanSpace);
    expect(player.canPlay(card)).is.not.true;

    player.game.addCity(player, spaceNotNextToOcean);
    expect(player.canPlay(card)).is.not.true;
  });

  it('canPlay', function() {
    player.megaCredits = card.cost;
    player.game.addOcean(player, oceanSpace);
    expect(player.canPlay(card)).is.not.true;

    player.game.addCity(player, spaceNextToOcean);
    expect(player.canPlay(card)).is.true;
  });

  it('canPlay - other player owns the city', function() {
    player.megaCredits = card.cost;
    player.game.addOcean(player, oceanSpace);
    expect(player.canPlay(card)).is.not.true;

    player.game.addCity(player2, spaceNextToOcean);
    expect(player.canPlay(card)).is.true;
  });

  it('play', function() {
    expect(player.production.megacredits).to.eq(0);

    card.play(player);

    expect(player.production.megacredits).to.eq(2);
  });
});
