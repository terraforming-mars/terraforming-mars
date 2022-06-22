import {expect} from 'chai';
import {AsteroidDeflectionSystem} from '../../../src/cards/promo/AsteroidDeflectionSystem';
import {Tags} from '../../../src/common/cards/Tags';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('AsteroidDeflectionSystem', function() {
  let card : AsteroidDeflectionSystem; let player : Player;

  beforeEach(function() {
    card = new AsteroidDeflectionSystem();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct()).is.true;

    while (player.game.dealer.discarded.find((card) => card.tags.includes(Tags.SPACE)) === undefined) {
      card.action(player);
    }

    expect(card.resourceCount).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(card.resourceCount);
  });
});
