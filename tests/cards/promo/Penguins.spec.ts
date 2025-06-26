import {expect} from 'chai';
import {Penguins} from '../../../src/server/cards/promo/Penguins';
import {IGame} from '../../../src/server/IGame';
import {maxOutOceans, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('Penguins', () => {
  let card: Penguins;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Penguins();
    [game, player] = testGame(1);
  });

  it('Cannot play', () => {
    maxOutOceans(player, 7);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    maxOutOceans(player, 8);
    expect(card.canPlay(player)).is.true;
  });

  it('Should act', () => {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.true;
    card.action(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should give victory points', () => {
    player.playedCards.push(card);
    card.action(player);
    runAllActions(game);
    card.action(player);
    runAllActions(game);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
