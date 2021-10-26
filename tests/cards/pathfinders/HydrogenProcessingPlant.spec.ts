import {expect} from 'chai';
import {HydrogenProcessingPlant} from '../../../src/cards/pathfinders/HydrogenProcessingPlant';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';
import {Units} from '../../../src/Units';

describe('HydrogenProcessingPlant', function() {
  let card: HydrogenProcessingPlant;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new HydrogenProcessingPlant();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
    player.playedCards.push(card);
  });

  it('canPlay', function() {
    (game as any).oxygenLevel = 2;
    expect(player.canPlayIgnoringCost(card)).is.false;

    (game as any).oxygenLevel = 3;
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('play', function() {
    game.increaseOxygenLevel(player, 1);
    game.increaseOxygenLevel(player, 1);
    game.increaseOxygenLevel(player, 1);
    expect(game.getOxygenLevel()).eq(3);
    TestingUtils.addOcean(player);
    TestingUtils.addOcean(player);
    TestingUtils.addOcean(player);
    TestingUtils.addOcean(player);
    TestingUtils.addOcean(player);
    TestingUtils.addOcean(player);
    expect(player.getProductionForTest()).deep.eq(Units.EMPTY);

    card.play(player);

    expect(game.getOxygenLevel()).eq(2);
    expect(player.getProductionForTest()).deep.eq(Units.of({energy: 3}));
  });
});

