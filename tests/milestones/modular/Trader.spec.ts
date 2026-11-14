import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '@/server/automa/boards/VenusMarsBot';
import {Trader} from '@/server/milestones/modular/Trader';
import {fakeMarsBot, setTrack} from '../../automa/FakeMarsBot';
import {CardResource} from '@/common/CardResource';
import {TestPlayer} from '../../TestPlayer';
import {fakeCard} from '../../TestingUtils';

describe('Trader', () => {
  it('Can claim with 3 resource types on cards', () => {
    const milestone = new Trader();
    const player = TestPlayer.BLUE.newPlayer();
    for (const resourceType of [CardResource.MICROBE, CardResource.ANIMAL]) {
      const card = fakeCard({resourceType});
      card.resourceCount = 1;
      player.playedCards.push(card);
    }
    expect(milestone.canClaim(player)).is.false;

    const floaters = fakeCard({resourceType: CardResource.FLOATER});
    floaters.resourceCount = 1;
    player.playedCards.push(floaters);
    expect(milestone.canClaim(player)).is.true;
  });

  for (const run of [
    {plant: 1, earth: 2, venus: 2, expected: false},
    {plant: 2, earth: 1, venus: 2, expected: false},
    {plant: 2, earth: 2, venus: 1, expected: false},
    {plant: 2, earth: 2, venus: 2, expected: true},
  ] as const) {
    it('MarsBot needs space 2 on its Bio, Earth and Venus tracks: ' + JSON.stringify(run), () => {
      const marsBot = fakeMarsBot({tracks: [...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]});
      setTrack(marsBot, Tag.PLANT, run.plant);
      setTrack(marsBot, Tag.EARTH, run.earth);
      setTrack(marsBot, Tag.VENUS, run.venus);

      expect(new Trader().marsBotCanClaim(marsBot)).eq(run.expected);
    });
  }
});
