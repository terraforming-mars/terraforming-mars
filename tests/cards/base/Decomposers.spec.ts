import {expect} from 'chai';
import {Algae} from '../../../src/server/cards/base/Algae';
import {Birds} from '../../../src/server/cards/base/Birds';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {EcologyExperts} from '../../../src/server/cards/prelude/EcologyExperts';
import {Game} from '../../../src/server/Game';
import {Phase} from '../../../src/common/Phase';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('Decomposers', function() {
  let card: Decomposers;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new Decomposers();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
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
