import {expect} from 'chai';
import {Inventrix} from '../../../src/cards/corporation/Inventrix';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('Inventrix', function() {
  let card : Inventrix; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Inventrix();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    card.play();
    expect(card.getRequirementBonus(player, game)).to.eq(2);
  });

  it('Should take initial action', function() {
    const action = card.initialAction(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(3);
  });
});
