import {expect} from 'chai';
import {Research} from '../../../src/server/cards/base/Research';
import {SubCrustMeasurements} from '../../../src/server/cards/promo/SubCrustMeasurements';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('SubCrustMeasurements', function() {
  let card: SubCrustMeasurements;
  let player: Player;

  beforeEach(function() {
    card = new SubCrustMeasurements();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play if not enough science tags', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research());
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(card.getVictoryPoints()).to.eq(2);
  });

  it('Should take action', function() {
    expect(player.cardsInHand).has.lengthOf(0);
    card.action(player);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
