import {expect} from 'chai';
import {SFMemorial} from '@/server/cards/prelude/SFMemorial';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('SFMemorial', () => {
  let card: SFMemorial;
  let player: TestPlayer;

  beforeEach(() => {
    card = new SFMemorial();
    [/* game */, player] = testGame(2);
  });

  it('Should play', () => {
    expect(player.cardsInHand).has.length(0);
    card.play(player);
    expect(player.cardsInHand).has.length(1);
  });
});
