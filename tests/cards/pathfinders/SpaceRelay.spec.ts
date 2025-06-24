import {expect} from 'chai';
import {SpaceRelay} from '../../../src/server/cards/pathfinders/SpaceRelay';
import {Tag} from '../../../src/common/cards/Tag';
import {TestPlayer} from '../../TestPlayer';
import {fakeCard, testGame} from '../../TestingUtils';

describe('SpaceRelay', () => {
  let card: SpaceRelay;
  let player: TestPlayer;

  beforeEach(() => {
    card = new SpaceRelay();
    [/* game */, player] = testGame(1);
  });

  it('play', () => {
    card.play(player);
    expect(player.production.megacredits).eq(1);
  });

  it('onCardPlayed', () => {
    card.onCardPlayed(player, fakeCard({tags: [Tag.VENUS]}));
    expect(player.cardsInHand).has.length(0);
    card.onCardPlayed(player, fakeCard({tags: [Tag.JOVIAN]}));
    expect(player.cardsInHand).has.length(1);
    card.onCardPlayed(player, fakeCard({tags: [Tag.WILD]}));
    expect(player.cardsInHand).has.length(1);
  });
});
