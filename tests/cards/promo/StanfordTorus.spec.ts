import {expect} from 'chai';
import {StanfordTorus} from '../../../src/server/cards/promo/StanfordTorus';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';

describe('StanfordTorus', () => {
  let card: StanfordTorus;
  let player: TestPlayer;

  beforeEach(() => {
    card = new StanfordTorus();
    [/* game */, player] = testGame(2, {promoCardsOption: true});
  });

  it('Should play', () => {
    card.play(player);
    expect(player.game.board.getCities()).has.length(1);
  });

  it('Should give victory points', () => {
    card.play(player);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
