
import {Player} from '../Player';
import {PlayerId} from '../../common/Types';
import {IMilestone} from './IMilestone';

export type ClaimedMilestone = {
  milestone: IMilestone;
  player: Player;
}

export type SerializedClaimedMilestone = {
  name?: string;
  playerId?: PlayerId;
}

export function serializeClaimedMilestones(claimedMilestones: Array<ClaimedMilestone>) : Array<SerializedClaimedMilestone> {
  return claimedMilestones.map((claimedMilestone) => {
    return {
      name: claimedMilestone.milestone.name,
      playerId: claimedMilestone.player.id,
    };
  });
}

export function deserializeClaimedMilestones(
  claimedMilestones: Array<SerializedClaimedMilestone>,
  players: Array<Player>,
  milestones: Array<IMilestone>): Array<ClaimedMilestone> {
  return claimedMilestones.map((element: SerializedClaimedMilestone) => {
    const milestoneName = element.name;
    if (milestoneName === undefined) {
      throw new Error('Milestone name not found');
    }
    const milestone: IMilestone | undefined = milestones.find((milestone) => milestone.name === milestoneName);
    if (milestone === undefined) {
      throw new Error(`Milestone ${milestoneName} not found when rebuilding Claimed Milestone`);
    }

    const playerId = element.playerId;
    if (playerId === undefined) {
      throw new Error(`Player ID not found when rebuilding claimed milestone ${milestoneName}`);
    }
    const player = players.find((player) => player.id === playerId);
    if (player === undefined) {
      throw new Error(`Player ${playerId} not found when rebuilding claimed milestone ${milestoneName}`);
    }

    return {milestone, player};
  });
}
