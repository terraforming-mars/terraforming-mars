import {expect} from 'chai';
import {AsteroidDeflectionSystem} from '../../../src/server/cards/promo/AsteroidDeflectionSystem';
import {Tag} from '../../../src/common/cards/Tag';
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
    player.production.add(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct()).is.true;

    while (player.game.projectDeck.discardPile.find((card) => card.tags.includes(Tag.SPACE)) === undefined) {
      card.action(player);
    }

    expect(card.resourceCount).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(card.resourceCount);
  });
});
