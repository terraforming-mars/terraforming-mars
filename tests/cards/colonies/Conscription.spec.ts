import {expect} from 'chai';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {Conscription} from '../../../src/server/cards/colonies/Conscription';
import {TestPlayer} from '../../TestPlayer';
import {cast, testGame} from '../../TestingUtils';

describe('Conscription', () => {
  let card: Conscription;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Conscription();
    [/* game */, player] = testGame(2);
  });

  it('play', () => {
    cast(card.play(player), undefined);
    expect(card.getVictoryPoints(player)).to.eq(-1);
    expect(card.getCardDiscount(player)).to.eq(0);
  });

  it('Should apply card discount until next card played', () => {
    player.playCard(card);
    expect(card.getCardDiscount(player)).to.eq(16);

    player.playCard(new MicroMills());

    expect(card.getCardDiscount(player)).to.eq(0);
  });

  it('Change in generation disables Indentured Workers', () => {
    player.playCard(card);
    expect(card.getCardDiscount(player)).to.eq(16);

    player.pass();

    expect(card.getCardDiscount(player)).to.eq(0);
  });
});
