import {expect} from 'chai';
import {Livestock} from '../../../src/server/cards/base/Livestock';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('Livestock', function() {
  let card: Livestock;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new Livestock();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play without plant production', function() {
    (game as any).oxygenLevel = 9;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can not play if oxygen level too low', function() {
    (game as any).oxygenLevel = 8;
    player.production.add(Resources.PLANTS, 1);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.PLANTS, 1);
    (game as any).oxygenLevel = 9;
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    player.playedCards.push(card);
    expect(player.production.plants).to.eq(0);
    expect(player.production.megacredits).to.eq(2);

    player.addResourceTo(card, 4);
    expect(card.getVictoryPoints()).to.eq(4);
  });

  it('Should act', function() {
    player.playedCards.push(card);
    card.action(player);
    expect(card.resourceCount).to.eq(1);
  });
});
