import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {SoilBacteria} from '../../../src/server/cards/prelude2/SoilBacteria';
import {Tag} from '../../../src/common/cards/Tag';
import {TestPlayer} from '../../TestPlayer';
import {Ants} from '../../../src/server/cards/base/Ants';
import {IGame} from '../../../src/server/IGame';

describe('SoilBacteria', () => {
  let card: SoilBacteria;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new SoilBacteria();
    [game, player] = testGame(1);
  });

  it('Should play', () => {
    card.play(player);
    expect(player.plants).to.eq(3);
    expect(player.cardsInHand).has.lengthOf(2);
    player.cardsInHand.forEach((card) => expect(card.tags.indexOf(Tag.MICROBE)).not.to.eq(-1));
  });
  it('Runs onCardPlayed', () => {
    card.play(player);
    card.onCardPlayed(player, new Ants());
    game.deferredActions.runNext();
    expect(player.stock.plants).to.eq(4);
  });
});
