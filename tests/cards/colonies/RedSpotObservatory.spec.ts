import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {RedSpotObservatory} from '../../../src/server/cards/colonies/RedSpotObservatory';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('RedSpotObservatory', function() {
  let card: RedSpotObservatory;
  let player: Player;

  beforeEach(function() {
    card = new RedSpotObservatory();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card, card);
    expect(player.canPlayIgnoringCost(card)).is.true;

    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct()).is.true;

    player.addResourceTo(card, 3);
    const orOptions = cast(card.action(player), OrOptions);
    orOptions.options[0].cb();

    expect(player.cardsInHand).has.lengthOf(1);
    expect(card.resourceCount).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
