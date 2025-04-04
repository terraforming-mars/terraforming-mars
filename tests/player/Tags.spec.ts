import {expect} from 'chai';
import {Tag} from '../../src/common/cards/Tag';
import {IPlayer} from '../../src/server/IPlayer';
import {TestPlayer} from '../TestPlayer';
import {Tags} from '../../src/server/player/Tags';
import {isICorporationCard} from '../../src/server/cards/corporation/ICorporationCard';
import {fakeCard, testGame} from '../TestingUtils';
import {CardType} from '../../src/common/cards/CardType';
import {CardName} from '../../src/common/cards/CardName';
import {newCard, newProjectCard} from '../../src/server/createCard';
import {GameOptions} from '../../src/server/game/GameOptions';
import {Odyssey} from '../../src/server/cards/pathfinders/Odyssey';

// Exposes rawCount available for testing.
class TestableTags extends Tags {
  constructor(player: IPlayer) {
    super(player);
  }
  public override rawCount(tag: Tag, includeEventsTags: boolean) {
    return super.rawCount(tag, includeEventsTags);
  }
}

describe('Tags', () => {
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

  it('count ignores event', () => {
    const [_, player] = testGame(1);
    const card = fakeCard({tags: [Tag.JOVIAN]});
    player.playedCards.push(card);

    expect(player.tags.count(Tag.JOVIAN)).eq(1);

    card.type = CardType.EVENT;

    expect(player.tags.count(Tag.JOVIAN)).eq(0);
  });

  it('count and distinctCount for Odyssey', () => {
    const [_, player] = testGame(1);
    const event = fakeCard({type: CardType.EVENT, tags: [Tag.JOVIAN]});
    const nonEvent = fakeCard({tags: [Tag.JOVIAN, Tag.BUILDING]});
    player.corporations.push(new Odyssey());
    player.playedCards.push(event);
    player.playedCards.push(nonEvent);

    expect(player.tags.count(Tag.JOVIAN)).eq(2);
    expect(player.tags.distinctCount('default')).eq(3);

    player.corporations = [];

    expect(player.tags.count(Tag.JOVIAN)).eq(1);
    expect(player.tags.distinctCount('default')).eq(2);
  });

  // cardTagCount()
  // multipleCount

  const tagsInGameRuns: ReadonlyArray<{options: Partial<GameOptions>, expected: number}> = [
    {options: {}, expected: 10},
    {options: {venusNextExtension: true}, expected: 11},
    {options: {coloniesExtension: true}, expected: 10},
    {options: {pathfindersExpansion: true}, expected: 12},
    {options: {venusNextExtension: true, pathfindersExpansion: true}, expected: 12},
    {options: {moonExpansion: true}, expected: 11},
  ] as const;
  for (const run of tagsInGameRuns) {
    it('tagsInGame ' + JSON.stringify(run), () => {
      const [_, player] = testGame(1, run.options);
      expect(player.tags.tagsInGame()).eq(run.expected);
    });
  }

  // distinctCount
  it('distinctCount', () => {
    const [_, player] = testGame(1);
    const tags = player.tags;
    expect(tags.distinctCount('default')).eq(0);
    expect(tags.distinctCount('default', Tag.ANIMAL)).eq(1);

    player.playedCards.push(newProjectCard(CardName.ADAPTATION_TECHNOLOGY)!);
    expect(tags.distinctCount('default')).eq(1);
    expect(tags.distinctCount('default', Tag.ANIMAL)).eq(2);
    expect(tags.distinctCount('default', Tag.SCIENCE)).eq(1);
    // Ignore disabled cards
    // Odyssey special case, events
    // Odyssey special case, event + wild + max
  });

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
