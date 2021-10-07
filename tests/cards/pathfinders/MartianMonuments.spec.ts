import {expect} from 'chai';
import {MartianMonuments} from '../../../src/cards/pathfinders/MartianMonuments';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';
import {Units} from '../../../src/Units';

describe('MartianMonuments', function() {
  let card: MartianMonuments;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    card = new MartianMonuments();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
  });

  it('can play', function() {
    expect(player.canPlayIgnoringCost(card)).is.false;
    TestingUtils.addCity(player);
    expect(player.canPlayIgnoringCost(card)).is.true;
    expect(player2.canPlayIgnoringCost(card)).is.false;
  });

  it('play', function() {
    player.tagsForTest = {mars: 8};
    card.play(player);
    expect(player.getProductionForTest()).deep.eq(Units.of({megacredits: 9})); // "including this"
  });
});
