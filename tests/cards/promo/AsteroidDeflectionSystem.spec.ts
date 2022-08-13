import {expect} from 'chai';
import {AsteroidDeflectionSystem} from '../../../src/server/cards/promo/AsteroidDeflectionSystem';
import {Tags} from '../../../src/common/cards/Tags';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('AsteroidDeflectionSystem', function() {
  let card: AsteroidDeflectionSystem;
  let player: Player;

  beforeEach(function() {
    card = new AsteroidDeflectionSystem();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
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
