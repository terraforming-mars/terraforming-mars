import {expect} from 'chai';
import {Pristar} from '../../../src/server/cards/turmoil/Pristar';
import {testGame} from '../../TestGame';
import {formatMessage} from '../../TestingUtils';

describe('Pristar', () => {
  it('Should play', () => {
    const card = new Pristar();
    const [game, player] = testGame(2);

    const play = card.play(player);
    player.playedCards.push(card);
    expect(play).is.undefined;
    player.megaCredits = 10;
    game.increaseTemperature(player, 1);
    card.onProductionPhase(player);
    expect(player.megaCredits).to.eq(10);
    expect(card.resourceCount).to.eq(0);
  });

  it('logs the added preservation resource', () => {
    const card = new Pristar();
    const [game, player] = testGame(2);
    player.playedCards.push(card);

    game.gameLog.length = 0;
    card.onProductionPhase(player);

    expect(game.gameLog.map(formatMessage).filter((message) => message.includes(' added '))).deep.eq([
      'blue added 1 Preservation to Pristar',
    ]);
  });
});
