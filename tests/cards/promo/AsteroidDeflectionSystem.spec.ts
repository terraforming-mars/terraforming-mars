import {expect} from 'chai';
import {AsteroidDeflectionSystem} from '../../../src/server/cards/promo/AsteroidDeflectionSystem';
import {Tag} from '../../../src/common/cards/Tag';
import {testGame} from '../../TestGame';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';

describe('AsteroidDeflectionSystem', function() {
  let card: AsteroidDeflectionSystem;
  let player: TestPlayer;

  beforeEach(function() {
    card = new AsteroidDeflectionSystem();
    [/* game */, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resource.ENERGY, 1);
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
    expect(card.getVictoryPoints(player)).to.eq(card.resourceCount);
  });
});
