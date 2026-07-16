import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {RedSpotObservatory} from '../../../src/server/cards/colonies/RedSpotObservatory';
import {testGame} from '../../TestGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';

describe('RedSpotObservatory', () => {
  let card: RedSpotObservatory;
  let player: TestPlayer;

  beforeEach(() => {
    card = new RedSpotObservatory();
    [/* game */, player] = testGame(2);
  });

  it('Can not play', () => {
    player.tagsForTest = {science: 2};
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', () => {
    player.tagsForTest = {science: 3};
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
  });

  it('Should act', () => {
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
