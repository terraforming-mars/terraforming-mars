import {expect} from 'chai';
import {Inventrix} from '../../../src/cards/corporation/Inventrix';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayer} from '../../TestPlayer';

describe('Inventrix', function() {
  let card: Inventrix;
  let player: Player;

  beforeEach(function() {
    card = new Inventrix();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    card.play();
    expect(card.getRequirementBonus()).to.eq(2);
  });

  it('Should take initial action', function() {
    const action = card.initialAction(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(3);
  });
});
