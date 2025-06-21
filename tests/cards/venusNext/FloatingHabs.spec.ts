import {expect} from 'chai';
import {churn, cast, runAllActions} from '../../TestingUtils';
import {Research} from '../../../src/server/cards/base/Research';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('FloatingHabs', () => {
  let card: FloatingHabs;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new FloatingHabs();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.playedCards.push(new Research());
    expect(card.canPlay(player)).is.true;
    cast(card.play(player), undefined);
  });

  it('Should act - single target', () => {
    player.playedCards.push(card);
    player.megaCredits = 10;

    card.action(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
    expect(player.megaCredits).to.eq(8);
  });

  it('Should act - multiple targets', () => {
    player.playedCards.push(card, new Dirigibles());
    player.megaCredits = 10;
    const selectCard = cast(churn(card.action(player), player), SelectCard);
    selectCard.cb([card]);
    game.deferredActions.runNext();
    expect(card.resourceCount).to.eq(1);
    expect(player.megaCredits).to.eq(8);
  });

  it('Gives victory points', () => {
    player.addResourceTo(card, 5);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
