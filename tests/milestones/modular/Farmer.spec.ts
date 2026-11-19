import {expect} from 'chai';
import {Birds} from '../../../src/server/cards/base/Birds';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Farmer} from '../../../src/server/milestones/modular/Farmer';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {fakeMarsBot, setTrack} from '../../automa/FakeMarsBot';
import {BoardName} from '@/common/boards/BoardName';
import {Tag} from '@/common/cards/Tag';

describe('Farmer', () => {
  let milestone: Farmer;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Farmer();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can claim with 5 animals or microbes', () => {
    const birds = new Birds();
    const ants = new Ants();
    player.playedCards.push(birds, ants);

    player.addResourceTo(ants);
    player.addResourceTo(ants);
    player.addResourceTo(birds);
    player.addResourceTo(birds);
    expect(milestone.canClaim(player)).is.false;

    player.addResourceTo(birds);
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot follows the Vastitas Borealis rule, except with the Milestones & Awards expansion', () => {
    for (const run of [
      {modularMA: false, tag: Tag.SCIENCE, position: 5, expected: false},
      {modularMA: false, tag: Tag.SCIENCE, position: 6, expected: true},
      {modularMA: false, tag: Tag.PLANT, position: 6, expected: true},
      {modularMA: true, tag: Tag.SCIENCE, position: 6, expected: false},
      {modularMA: true, tag: Tag.PLANT, position: 6, expected: false},
      {modularMA: true, tag: Tag.PLANT, position: 7, expected: true},
    ]) {
      const [game] = testGame(1, {boardName: BoardName.VASTITAS_BOREALIS_NOVA, modularMA: run.modularMA});
      const bot = fakeMarsBot({game});
      setTrack(bot, run.tag, run.position);

      expect(milestone.marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
