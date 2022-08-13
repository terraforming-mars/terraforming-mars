import {expect} from 'chai';
import {Penguins} from '../../../src/server/cards/promo/Penguins';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('Penguins', function() {
  let card: Penguins;
  let player: Player;

  beforeEach(function() {
    card = new Penguins();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
  });

  it('Cannot play', function() {
    maxOutOceans(player, 7);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    maxOutOceans(player, 8);
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct()).is.true;
    card.action(player);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should give victory points', function() {
    player.playedCards.push(card);
    card.action(player);
    card.action(player);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
