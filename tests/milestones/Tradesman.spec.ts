import {expect} from 'chai';
import {Birds} from '../../src/server/cards/base/Birds';
import {CometAiming} from '../../src/server/cards/promo/CometAiming';
import {Dirigibles} from '../../src/server/cards/venusNext/Dirigibles';
import {Tradesman} from '../../src/server/milestones/Tradesman';
import {TestPlayer} from '../TestPlayer';
import {Tag} from '../../src/common/cards/Tag';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '@/server/automa/boards/VenusMarsBot';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';

describe('Tradesman', () => {
  let milestone: Tradesman;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Tradesman();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can claim with 3 types of non-standard resources', () => {
    const cometAiming = new CometAiming();
    const birds = new Birds();
    const dirigibles = new Dirigibles();
    player.playedCards.push(cometAiming, birds, dirigibles);

    player.addResourceTo(cometAiming);
    player.addResourceTo(birds);
    expect(milestone.canClaim(player)).is.false;

    player.addResourceTo(dirigibles);
    expect(milestone.canClaim(player)).is.true;
  });

  it('Can claim with corruption', () => {
    const cometAiming = new CometAiming();
    const birds = new Birds();
    player.playedCards.push(cometAiming, birds);

    player.addResourceTo(cometAiming);
    player.underworldData.corruption = 1;
    expect(milestone.canClaim(player)).is.false;

    player.addResourceTo(birds);
    expect(milestone.canClaim(player)).is.true;
  });

  for (const run of [
    {power: 2, earth: 2, venus: 2, expected: true},
    {power: 1, earth: 2, venus: 2, expected: false},
    {power: 2, earth: 1, venus: 2, expected: false},
    {power: 2, earth: 2, venus: 1, expected: false},
  ] as const) {
    it('MarsBot needs space 2 on its Energy, Earth and Venus tracks: ' + JSON.stringify(run), () => {
      const bot = fakeMarsBot([...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]);
      setTrack(bot, Tag.POWER, run.power);
      setTrack(bot, Tag.EARTH, run.earth);
      setTrack(bot, Tag.VENUS, run.venus);

      expect(milestone.marsBotCanClaim(bot)).eq(run.expected);
    });
  }
});
