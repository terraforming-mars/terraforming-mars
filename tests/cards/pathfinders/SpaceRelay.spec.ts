import {expect} from 'chai';
import {SpaceRelay} from '../../../src/server/cards/pathfinders/SpaceRelay';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {Tag} from '../../../src/common/cards/Tag';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

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
    card.onCardPlayed(player, {tags: [Tag.VENUS]} as IProjectCard);
    expect(player.cardsInHand).has.length(0);
    card.onCardPlayed(player, {tags: [Tag.JOVIAN]} as IProjectCard);
    expect(player.cardsInHand).has.length(1);
    card.onCardPlayed(player, {tags: [Tag.WILD]} as IProjectCard);
    expect(player.cardsInHand).has.length(1);
  });
});
