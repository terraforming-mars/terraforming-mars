import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {Research} from '../../../src/server/cards/base/Research';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Extremophiles} from '../../../src/server/cards/venusNext/Extremophiles';
import {testGame} from '../../TestGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';

describe('Extremophiles', function() {
  let card: Extremophiles;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Extremophiles();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research());
    expect(card.canPlay(player)).is.true;
    cast(card.play(player), undefined);
  });

  it('Should act', function() {
    player.playedCards.push(card);
    card.action(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should act - multiple targets', function() {
    player.playedCards.push(card, new Tardigrades());
    card.action(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard);
    action.cb([card]);

    expect(card.resourceCount).to.eq(1);
  });

  it('Gives victory points', function() {
    player.addResourceTo(card, 7);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
