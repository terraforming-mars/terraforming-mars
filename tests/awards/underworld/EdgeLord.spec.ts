import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {EdgeLord} from '../../../src/server/awards/underworld/EdgeLord';
import {TestPlayer} from '../../TestPlayer';
import {IPlayer} from '../../../src/server/IPlayer';
import {SpaceId} from '../../../src/common/Types';

describe('EdgeLord', () => {
  let award: EdgeLord;
  let player: TestPlayer;

  beforeEach(() => {
    award = new EdgeLord();
    [/* game */, player] = testGame(2, {underworldExpansion: true});
  });

  it('getScore', () => {
    function excavate(player: IPlayer, spaceId: SpaceId) {
      const space = player.game.board.getSpace(spaceId);
      space.undergroundResources = 'nothing';
      space.excavator = player;
    }

    expect(award.getScore(player)).eq(0);

    excavate(player, '03'); // Edge
    expect(award.getScore(player)).eq(1);

    excavate(player, '11'); // Not Edge
    expect(award.getScore(player)).eq(1);

    excavate(player, '28'); // Edge
    expect(award.getScore(player)).eq(2);

    excavate(player, '29'); // Edge
    expect(award.getScore(player)).eq(3);

    excavate(player, '55'); // Not Edge
    expect(award.getScore(player)).eq(3);

    excavate(player, '62'); // Not Edge
    expect(award.getScore(player)).eq(4);
  });
});
