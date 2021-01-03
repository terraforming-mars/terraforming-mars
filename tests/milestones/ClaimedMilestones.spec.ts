import {expect} from 'chai';
import {deserializeClaimedMilestones, serializeClaimedMilestones, SerializedClaimedMilestone} from '../../src/milestones/ClaimedMilestone';
import {ClaimedMilestone} from '../../src/milestones/ClaimedMilestone';
import {Diversifier} from '../../src/milestones/Diversifier';
import {Generalist} from '../../src/milestones/Generalist';
import {TestPlayers} from '../TestingUtils';

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
        {'name': 'Diversifier', 'playerId': 'blue-id'},
        {'name': 'Generalist', 'playerId': 'red-id'},
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

  it('backward compatible deserialization', () => {
    const bluePlayer = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const json =
      [
        {
          'milestone': {
            'name': 'Diversifier',
          }, 'player': {
            'id': 'blue-id',
          },
        },
        {
          'milestone': {
            'name': 'Generalist',
          }, 'player': {
            'id': 'red-id',
          },
        },
      ] as Array<SerializedClaimedMilestone>;

    const diversifier = new Diversifier();
    const generalist = new Generalist();
    const deserialized = deserializeClaimedMilestones(
      json,
      [redPlayer, bluePlayer],
      [diversifier, generalist]);
    expect(deserialized[0].milestone === diversifier);
    expect(deserialized[0].player === bluePlayer);
    expect(deserialized[1].milestone === generalist);
    expect(deserialized[1].player === redPlayer);
  });
});
