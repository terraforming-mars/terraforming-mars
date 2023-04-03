import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Research} from '../../../src/server/cards/base/Research';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Extremophiles} from '../../../src/server/cards/venusNext/Extremophiles';
import {testGame} from '../../TestGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';

describe('Extremophiles', function() {
  let card: Extremophiles;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Extremophiles();
    [/* skipped */, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research());
    expect(player.simpleCanPlay(card)).is.true;
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    card.action(player);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should act - multiple targets', function() {
    player.playedCards.push(card, new Tardigrades());
    const action = cast(card.action(player), SelectCard);
    action.cb([card]);

    expect(card.resourceCount).to.eq(1);
  });

  it('Gives victory points', function() {
    player.addResourceTo(card, 7);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
