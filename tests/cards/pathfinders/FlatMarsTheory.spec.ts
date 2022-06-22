import {expect} from 'chai';
import {FlatMarsTheory} from '../../../src/cards/pathfinders/FlatMarsTheory';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {Units} from '../../../src/common/Units';

describe('FlatMarsTheory', function() {
  let card: FlatMarsTheory;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new FlatMarsTheory();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('canPlay', function() {
    player.tagsForTest = {};
    expect(player.canPlayIgnoringCost(card)).is.true;

    player.tagsForTest = {science: 1};
    expect(player.canPlayIgnoringCost(card)).is.true;

    player.tagsForTest = {science: 2};
    expect(player.canPlayIgnoringCost(card)).is.false;

    player.tagsForTest = {science: 1, wild: 1};
    expect(player.canPlayIgnoringCost(card)).is.true;

    player.tagsForTest = {wild: 2};
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('play', function() {
    (game as any).generation = 4;
    card.play(player);
    expect(player.getProductionForTest()).deep.eq(Units.of({megacredits: 4}));

    player.setProductionForTest(Units.EMPTY);
    (game as any).generation = 7;
    card.play(player);
    expect(player.getProductionForTest()).deep.eq(Units.of({megacredits: 7}));
  });
});
