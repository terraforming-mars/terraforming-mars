import {expect} from 'chai';
import {deserializeClaimedMilestones, serializeClaimedMilestones} from '../../src/server/milestones/ClaimedMilestone';
import {ClaimedMilestone} from '../../src/server/milestones/ClaimedMilestone';
import {Diversifier} from '../../src/server/milestones/Diversifier';
import {Generalist} from '../../src/server/milestones/Generalist';
import {TestPlayer} from '../TestPlayer';

describe('ClaimedMilestones', function() {
  it('test serialization', () => {
    const bluePlayer = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const claimedMilestones: Array<ClaimedMilestone> = [
      {
        milestone: new Diversifier(),
        player: bluePlayer,
      }, {
        milestone: new Generalist(),
        player: redPlayer,
      },
    ];
    const serialized = serializeClaimedMilestones(claimedMilestones);
    expect(serialized).to.deep.eq(
      [
        {'name': 'Diversifier', 'playerId': 'p-blue-id'},
        {'name': 'Generalist', 'playerId': 'p-red-id'},
      ],
    );

    const diversifier = new Diversifier();
    const generalist = new Generalist();
    const deserialized = deserializeClaimedMilestones(
      serialized,
      [redPlayer, bluePlayer],
      [diversifier, generalist]);
    expect(deserialized[0].milestone === diversifier);
    expect(deserialized[0].player === bluePlayer);
    expect(deserialized[1].milestone === generalist);
    expect(deserialized[1].player === redPlayer);
  });
});
