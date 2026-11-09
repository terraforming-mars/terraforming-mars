import {expect} from 'chai';
import {Generalist} from '../../src/server/milestones/Generalist';
import {ALL_RESOURCES} from '../../src/common/Resource';
import {testGame} from '../TestingUtils';
import {Tag} from '@/common/cards/Tag';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '@/server/automa/boards/VenusMarsBot';
import {fakeMarsBot, setAllTracks, setTrack} from '../automa/FakeMarsBot';

describe('Generalist', () => {
  let milestone: Generalist;

  beforeEach(() => {
    milestone = new Generalist();
  });

  it('Can claim with +1 of each production in game with corp era', () => {
    const [/* game */, player/* , player2 */] = testGame(2);
    ALL_RESOURCES.forEach((resource) => player.production.add(resource, 1));

    expect(milestone.canClaim(player)).is.true;
  });

  it('Cannot claim with +1 of each production in game without corp era', () => {
    const [/* game */, player/* , player2 */] = testGame(2, {corporateEra: false});

    ALL_RESOURCES.forEach((resource) => expect(player.production[resource]).to.eq(1));
    expect(milestone.canClaim(player)).is.not.true;
  });

  it('Can claim with +2 of each production in game without corp era', () => {
    const [/* game */, player/* , player2 */] = testGame(2, {corporateEra: false});
    ALL_RESOURCES.forEach((resource) => player.production.add(resource, 1));

    ALL_RESOURCES.forEach((resource) => expect(player.production[resource]).to.eq(2));
    expect(milestone.canClaim(player)).is.true;
  });

  for (const run of [
    {plant: 1, expected: false},
    {plant: 2, expected: true},
  ] as const) {
    it(`MarsBot needs space 2 on every track except Venus, ${JSON.stringify(run)}`, () => {
      const bot = fakeMarsBot({tracks: [...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]});
      setAllTracks(bot, 2);
      setTrack(bot, Tag.VENUS, 0);
      setTrack(bot, Tag.PLANT, run.plant);

      expect(milestone.marsBotCanClaim(bot)).eq(run.expected);
    });
  }
});
