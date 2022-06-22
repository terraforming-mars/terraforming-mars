import {expect} from 'chai';
import {RedSpotObservatory} from '../../../src/cards/colonies/RedSpotObservatory';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('RedSpotObservatory', function() {
  let card : RedSpotObservatory; let player : Player;

  beforeEach(function() {
    card = new RedSpotObservatory();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
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
    const orOptions = card.action(player) as OrOptions;
    expect(orOptions instanceof OrOptions).is.true;
        orOptions!.options[0].cb();

        expect(player.cardsInHand).has.lengthOf(1);
        expect(card.resourceCount).to.eq(2);
        expect(card.getVictoryPoints()).to.eq(2);
  });
});
