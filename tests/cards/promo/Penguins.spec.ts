import {expect} from 'chai';
import {Penguins} from '../../../src/server/cards/promo/Penguins';
import {Game} from '../../../src/server/Game';
import {maxOutOceans, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('Penguins', function() {
  let card: Penguins;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Penguins();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
  });

  it('Cannot play', function() {
    maxOutOceans(player, 7);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    maxOutOceans(player, 8);
    expect(card.canPlay(player)).is.true;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.true;
    card.action(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should give victory points', function() {
    player.playedCards.push(card);
    card.action(player);
    runAllActions(game);
    card.action(player);
    runAllActions(game);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
