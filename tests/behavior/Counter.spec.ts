import {expect} from 'chai';
import {Counter} from '../../src/server/behavior/Counter';
import {Game} from '../../src/server/Game';
import {TestPlayer} from '../TestPlayer';
import {getTestPlayer, newTestGame} from '../TestGame';
import {Tag} from '../../src/common/cards/Tag';
import {fakeCard} from '../TestingUtils';
import {IProjectCard} from '../../src/server/cards/IProjectCard';

describe('Counter', () => {
  let game: Game;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let fake: IProjectCard;

  beforeEach(() => {
    game = newTestGame(3, {venusNextExtension: true});
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    player3 = getTestPlayer(game, 2);
    player.popSelectInitialCards();
    player2.popSelectInitialCards();
    player3.popSelectInitialCards();
    fake = fakeCard({});
  });

  it('numbers', () => {
    const counter = new Counter(player, fake);
    expect(counter.count(3)).eq(3);
    expect(counter.count(8)).eq(8);
  });

  it('tags, simple', () => {
    player.tagsForTest = {building: 2, space: 3, moon: 7};
    const counter = new Counter(player, fake);
    expect(counter.count({tag: Tag.BUILDING})).eq(2);
    expect(counter.count({tag: Tag.SPACE})).eq(3);

    expect(counter.count({tag: Tag.BUILDING, each: 3})).eq(6);
    expect(counter.count({tag: Tag.MOON, per: 3})).eq(2);
  });

  it('tags, multiple', () => {
    player.tagsForTest = {building: 2, space: 3, moon: 7};
    const counter = new Counter(player, fake);
    expect(counter.count({tag: [Tag.BUILDING, Tag.MOON]})).eq(9);

    // Wild only counts once. It's really a test for tags.count, but it's useful to see here.
    player.tagsForTest = {building: 2, space: 3, moon: 7, wild: 1};
    expect(counter.count({tag: [Tag.BUILDING, Tag.MOON]})).eq(10);
  });

  it('tags, all and others', () => {
    player.tagsForTest = {building: 2, space: 3, moon: 7};
    player2.tagsForTest = {space: 4};
    player3.tagsForTest = {microbe: 8, wild: 2}; // Wild tags will be ignored.

    const counter = new Counter(player, fake);
    expect(counter.count({tag: Tag.BUILDING, all: true})).eq(2);
    expect(counter.count({tag: Tag.SPACE, all: true})).eq(7);
    expect(counter.count({tag: Tag.MICROBE, all: true})).eq(8);
    expect(counter.count({tag: Tag.SPACE, others: true})).eq(4);
  });

  it('tags, including this', () => {
    let counter = new Counter(player, fake);

    fake.tags = [Tag.CITY];
    expect(counter.count({tag: Tag.CITY})).eq(1);
    player.tagsForTest = {city: 1};
    expect(counter.count({tag: Tag.CITY})).eq(2);

    // Unset this so playedCards are counted more closely. It's a weird thing about tagsForTes.
    player.tagsForTest = undefined;
    player.playedCards = [fakeCard({tags: [Tag.CITY, Tag.CITY]})];
    expect(counter.count({tag: Tag.CITY})).eq(3);

    // Adding it to the player's tableau doesn't double-count it.
    player.playedCards.push(fake);
    // New game state needs a new Counter.
    counter = new Counter(player, fake);
    expect(counter.count({tag: Tag.CITY})).eq(3);
  });
});
