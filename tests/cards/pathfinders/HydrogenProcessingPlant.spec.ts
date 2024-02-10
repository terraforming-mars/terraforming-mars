import {expect} from 'chai';
import {HydrogenProcessingPlant} from '../../../src/server/cards/pathfinders/HydrogenProcessingPlant';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {addOcean, setOxygenLevel} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';

describe('HydrogenProcessingPlant', function() {
  let card: HydrogenProcessingPlant;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new HydrogenProcessingPlant();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
    player.playedCards.push(card);
  });

  it('canPlay', function() {
    setOxygenLevel(game, 2);
    expect(card.canPlay(player)).is.false;

    setOxygenLevel(game, 3);
    expect(card.canPlay(player)).is.true;
  });

  it('play', function() {
    game.increaseOxygenLevel(player, 1);
    game.increaseOxygenLevel(player, 1);
    game.increaseOxygenLevel(player, 1);
    expect(game.getOxygenLevel()).eq(3);
    addOcean(player);
    addOcean(player);
    addOcean(player);
    addOcean(player);
    addOcean(player);
    addOcean(player);
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);

    card.play(player);

    expect(game.getOxygenLevel()).eq(2);
    expect(player.production.asUnits()).deep.eq(Units.of({energy: 3}));
  });
});

