import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TestPlayer} from '../../TestPlayer';
import {MartianEmbassy} from '../../../src/cards/moon/MartianEmbassy';
import {expect} from 'chai';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true, pathfindersExpansion: true});

describe('MartianEmbassy', () => {
  let player: TestPlayer;
  let card: MartianEmbassy;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new MartianEmbassy();
  });

  it('play', () => {
    // Once the Pathfinders track is implemented, these tests will fail,
    // so this is a good short-term test.
    player.tagsForTest = {moon: 2};
    expect(() => card.play(player)).to.throw(Error, /(0)/);

    player.tagsForTest = {moon: 3};
    expect(() => card.play(player)).to.throw(Error, /(1)/);

    player.tagsForTest = {moon: 5};
    expect(() => card.play(player)).to.throw(Error, /(1)/);

    player.tagsForTest = {moon: 6};
    expect(() => card.play(player)).to.throw(Error, /(2)/);
  });
});

