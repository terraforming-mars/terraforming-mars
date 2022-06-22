import {expect} from 'chai';
import {deserializeClaimedMilestones, serializeClaimedMilestones} from '../../src/milestones/ClaimedMilestone';
import {ClaimedMilestone} from '../../src/milestones/ClaimedMilestone';
import {Diversifier} from '../../src/milestones/Diversifier';
import {Generalist} from '../../src/milestones/Generalist';
import {TestPlayers} from '../TestPlayers';

describe('ClaimedMilestones', function() {
  it('test serialization', () => {
    const bluePlayer = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
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
