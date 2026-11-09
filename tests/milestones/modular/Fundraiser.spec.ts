import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Fundraiser} from '../../../src/server/milestones/modular/Fundraiser';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {BoardName} from '@/common/boards/BoardName';
import {Tag} from '@/common/cards/Tag';
import {fakeMarsBot, setTrack} from '../../automa/FakeMarsBot';

describe('Fundraiser', () => {
  let milestone: Fundraiser;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Fundraiser();
    [/* game */, player] = testGame(2);
  });

  it('Cannot claim with zero production', () => {
    expect(milestone.canClaim(player)).is.false;
  });

  it('Cannot claim with less than 12 production', () => {
    player.production.add(Resource.MEGACREDITS, 8);

    expect(milestone.canClaim(player)).is.false;
  });

  it('Can claim with exactly 12 production', () => {
    player.production.add(Resource.MEGACREDITS, 12);

    expect(milestone.canClaim(player)).is.true;
  });

  it('Can claim with more than 12 production', () => {
    player.production.add(Resource.MEGACREDITS, 15);

    expect(milestone.canClaim(player)).is.true;
  });

  for (const run of [
    {modularMA: false, event: 9, expected: false},
    {modularMA: false, event: 10, expected: true},
    {modularMA: true, event: 7, expected: false},
    {modularMA: true, event: 8, expected: true},
  ] as const) {
    it('MarsBot needs space 10 of its Event track on Terra Cimmeria and space 8 with the expansion: ' + JSON.stringify(run), () => {
      const [game] = testGame(1, {boardName: BoardName.TERRA_CIMMERIA_NOVA, modularMA: run.modularMA});
      const marsBot = fakeMarsBot({game});
      setTrack(marsBot, Tag.EVENT, run.event);

      expect(milestone.marsBotCanClaim(marsBot)).eq(run.expected);
    });
  }
});
