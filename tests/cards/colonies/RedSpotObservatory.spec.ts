import {expect} from 'chai';
import {RedSpotObservatory} from '../../../src/cards/colonies/RedSpotObservatory';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('RedSpotObservatory', function() {
  let card : RedSpotObservatory; let player : Player; let game : Game;

  beforeEach(function() {
    card = new RedSpotObservatory();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = new Game('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card, card);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player, game);
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct()).is.true;

    player.addResourceTo(card, 3);
    const orOptions = card.action(player, game) as OrOptions;
    expect(orOptions instanceof OrOptions).is.true;
        orOptions!.options[0].cb();

        expect(player.cardsInHand).has.lengthOf(1);
        expect(player.getResourcesOnCard(card)).to.eq(2);
        expect(card.getVictoryPoints()).to.eq(2);
  });
});
