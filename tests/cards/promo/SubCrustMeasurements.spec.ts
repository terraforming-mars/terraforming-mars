import {expect} from 'chai';
import {Research} from '../../../src/server/cards/base/Research';
import {SubCrustMeasurements} from '../../../src/server/cards/promo/SubCrustMeasurements';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';

describe('SubCrustMeasurements', () => {
  let card: SubCrustMeasurements;
  let player: TestPlayer;

  beforeEach(() => {
    card = new SubCrustMeasurements();
    [/* game */, player] = testGame(2);
  });

  it('Can not play if not enough science tags', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.playedCards.push(new Research());
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });

  it('Should take action', () => {
    expect(player.cardsInHand).has.lengthOf(0);
    card.action(player);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
