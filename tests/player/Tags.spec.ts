import {expect} from 'chai';
import {Tag} from '../../src/common/cards/Tag';
import {IPlayer} from '../../src/server/IPlayer';
import {TestPlayer} from '../TestPlayer';
import {Tags} from '../../src/server/player/Tags';
import {isICorporationCard} from '../../src/server/cards/corporation/ICorporationCard';
import {fakeCard} from '../TestingUtils';
import {CardType} from '../../src/common/cards/CardType';
import {CardName} from '../../src/common/cards/CardName';
import {newCard} from '../../src/server/createCard';

// Exposes rawCount available for testing.
class TestableTags extends Tags {
  constructor(player: IPlayer) {
    super(player);
  }
  public override rawCount(tag: Tag, includeEventsTags: boolean) {
    return super.rawCount(tag, includeEventsTags);
  }
}

describe('Tags', function() {
  let player: IPlayer;
  let tags: TestableTags;

  beforeEach(() => {
    player = TestPlayer.BLACK.newPlayer();
    tags = new TestableTags(player);
  });

  function playFakeCorporation(...tags: Array<Tag>) {
    const card = fakeCard({type: CardType.CORPORATION, tags: tags});
    if (isICorporationCard(card)) {
      player.corporations.push(card);
    } else {
      throw new Error('Internal error while making a fake corporation card)');
    }
  }

  function playFakeEvent(...tags: Array<Tag>) {
    const card = fakeCard({type: CardType.EVENT, tags: tags});
    player.playedCards.push(card);
  }

  function playFakeProject(...tags: Array<Tag>) {
    const card = fakeCard({type: CardType.AUTOMATED, tags: tags});
    player.playedCards.push(card);
  }

  // getAllTags
  // count(...)

  const cardHasTagRuns = [
    {card: CardName.MICRO_MILLS, tag: Tag.ANIMAL, expected: false},
    {card: CardName.BIRDS, tag: Tag.ANIMAL, expected: true},
    {card: CardName.BRIBED_COMMITTEE, tag: Tag.EVENT, expected: true},
  ] as const;
  for (const run of cardHasTagRuns) {
    it('cardHasTag ' + JSON.stringify(run), () => {
      expect(tags.cardHasTag(newCard(run.card)!, run.tag)).eq(run.expected);
    });
  }

  // cardTagCount()
  // multipleCount
  // distinctCount
  // playerHas
  it('rawCount', () => {
    expect(tags.rawCount(Tag.BUILDING, false)).eq(0);

    playFakeProject(Tag.BUILDING);

    expect(tags.rawCount(Tag.BUILDING, false)).eq(1);

    playFakeEvent(Tag.BUILDING);

    expect(tags.rawCount(Tag.BUILDING, false)).eq(1);
    expect(tags.rawCount(Tag.BUILDING, true)).eq(2);

    playFakeCorporation(Tag.BUILDING);

    expect(tags.rawCount(Tag.BUILDING, false)).eq(2);
    expect(tags.rawCount(Tag.BUILDING, true)).eq(3);
  });
});
