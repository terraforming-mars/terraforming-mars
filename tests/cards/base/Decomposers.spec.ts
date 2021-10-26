import {expect} from 'chai';
import {Algae} from '../../../src/cards/base/Algae';
import {Birds} from '../../../src/cards/base/Birds';
import {Decomposers} from '../../../src/cards/base/Decomposers';
import {EcologyExperts} from '../../../src/cards/prelude/EcologyExperts';
import {Game} from '../../../src/Game';
import {Phase} from '../../../src/Phase';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('Decomposers', function() {
  let card : Decomposers; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Decomposers();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 3;
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);

    card.onCardPlayed(player, new Birds());
    expect(card.resourceCount).to.eq(1);
    card.onCardPlayed(player, card);
    expect(card.resourceCount).to.eq(2);
    card.onCardPlayed(player, new Algae());

    expect(card.resourceCount).to.eq(3);
    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Should get triggered by EcoExperts if played together', function() {
    const ecoExpertCard = new EcologyExperts();
    game.phase = Phase.PRELUDES;
    player.playCard(ecoExpertCard);
    expect(player.canPlayIgnoringCost(card)).is.true;
    player.playCard(card);
    expect(card.resourceCount).to.eq(3);
  });
});
