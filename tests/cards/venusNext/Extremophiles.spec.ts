import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {Research} from '../../../src/server/cards/base/Research';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Extremophiles} from '../../../src/server/cards/venusNext/Extremophiles';
import {testGame} from '../../TestGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';

describe('Extremophiles', () => {
  let card: Extremophiles;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Extremophiles();
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

  it('Should act', () => {
    player.playedCards.push(card);
    card.action(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should act - multiple targets', () => {
    player.playedCards.push(card, new Tardigrades());
    card.action(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard);
    action.cb([card]);

    expect(card.resourceCount).to.eq(1);
  });

  it('Gives victory points', () => {
    player.addResourceTo(card, 7);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
