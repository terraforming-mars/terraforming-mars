import {expect} from 'chai';
import {AsteroidDeflectionSystem} from '../../../src/server/cards/promo/AsteroidDeflectionSystem';
import {Tag} from '../../../src/common/cards/Tag';
import {testGame} from '../../TestGame';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';

describe('AsteroidDeflectionSystem', () => {
  let card: AsteroidDeflectionSystem;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new AsteroidDeflectionSystem();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.energy).to.eq(0);
  });

  it('Should act', () => {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.true;

    while (player.game.projectDeck.discardPile.find((card) => card.tags.includes(Tag.SPACE)) === undefined) {
      card.action(player);
    }

    expect(card.resourceCount).to.eq(1);
    expect(card.getVictoryPoints(player)).to.eq(card.resourceCount);
  });

  it('Cannot act when the deck is empty', () => {
    game.projectDeck.drawPile.length = 1;

    expect(card.canAct(player)).is.true;

    game.projectDeck.drawPile.length = 0;

    expect(card.canAct(player)).is.false;
  });
});
