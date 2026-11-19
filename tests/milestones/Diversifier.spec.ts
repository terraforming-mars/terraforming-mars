import {expect} from 'chai';
import {Diversifier} from '../../src/server/milestones/Diversifier';
import {TestPlayer} from '../TestPlayer';
import {Leavitt} from '../../src/server/cards/community/Leavitt';
import {AntiGravityTechnology} from '../../src/server/cards/base/AntiGravityTechnology';
import {testGame} from '../TestGame';
import {fakeCard} from '../TestingUtils';
import {Tag} from '../../src/common/cards/Tag';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '@/server/automa/boards/VenusMarsBot';
import {fakeMarsBot, setAllTracks, setTrack} from '../automa/FakeMarsBot';

describe('Diversifier', () => {
  let milestone: Diversifier;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Diversifier();
    [/* game */, player] = testGame(2);
  });

  it('Counts wild tags tags as unique tags', () => {
    const milestone = new Diversifier();
    player.playedCards.push(fakeCard({tags: [Tag.WILD, Tag.WILD, Tag.WILD, Tag.WILD, Tag.WILD, Tag.WILD, Tag.WILD]}));
    expect(milestone.canClaim(player)).is.not.true;
    player.playedCards.push(fakeCard({tags: [Tag.WILD]}));
    expect(milestone.canClaim(player)).is.true;
  });

  it('Counts Leavitt science tag placement bonus', () => {
    const [game, player] = testGame(1, {coloniesExtension: true});
    const leavitt = new Leavitt();
    game.colonies = [leavitt];

    leavitt.addColony(player);
    expect(milestone.getScore(player)).eq(1);

    // Adding a second colony doesn't change things
    leavitt.addColony(player);
    expect(milestone.getScore(player)).eq(1);

    // Or another science card.
    player.playedCards.push(new AntiGravityTechnology());
    expect(milestone.getScore(player)).eq(1);

    player.playedCards.push(fakeCard({tags: [Tag.WILD, Tag.WILD, Tag.WILD, Tag.WILD, Tag.WILD, Tag.WILD, Tag.WILD]}));
    expect(milestone.getScore(player)).eq(8);
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot needs space 3 on 7 tracks, so Venus can stand in for one other track', () => {
    for (const run of [
      {plant: 2, expected: false},
      {plant: 3, expected: true},
    ]) {
      const bot = fakeMarsBot({tracks: [...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]});
      setAllTracks(bot, 3);
      setTrack(bot, Tag.VENUS, 2);
      setTrack(bot, Tag.PLANT, run.plant);

      expect(milestone.marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
