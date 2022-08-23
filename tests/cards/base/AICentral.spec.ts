import {expect} from 'chai';
import {AICentral} from '../../../src/server/cards/base/AICentral';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {Resources} from '../../../src/common/Resources';

describe('AICentral', function() {
  let card: AICentral;
  let player: TestPlayer;

  beforeEach(function() {
    card = new AICentral();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play if not enough science tags to play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play if no energy production', function() {
    player.playedCards.push(card, card, card);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card, card);
    player.production.add(Resources.ENERGY, 1);

    card.play(player);
    expect(player.production.energy).to.eq(0);
    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Should take action', function() {
    card.action(player);
    expect(player.cardsInHand).has.lengthOf(2);
  });
});
