import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {RedSpotObservatory} from '../../../src/server/cards/colonies/RedSpotObservatory';
import {testGame} from '../../TestGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';

describe('RedSpotObservatory', function() {
  let card: RedSpotObservatory;
  let player: TestPlayer;

  beforeEach(function() {
    card = new RedSpotObservatory();
    [/* skipped */, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card, card);
    expect(player.simpleCanPlay(card)).is.true;

    cast(card.play(player), undefined);
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct()).is.true;

    player.addResourceTo(card, 3);
    const orOptions = cast(card.action(player), OrOptions);
    orOptions.options[0].cb();

    expect(player.cardsInHand).has.lengthOf(1);
    expect(card.resourceCount).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
