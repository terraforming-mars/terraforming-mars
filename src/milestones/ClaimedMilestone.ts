
import {Player, PlayerId} from '../Player';
import {IMilestone} from './IMilestone';

export interface ClaimedMilestone {
  milestone: IMilestone;
  player: Player;
}

// TODO(kberg): remove references to milesetone and player by 2020-02-01
export interface SerializedClaimedMilestone {
  name?: string;
  playerId?: PlayerId;
  milestone?: IMilestone;
  player?: Player;
}

export function serializeClaimedMilestones(claimedMilestones: Array<ClaimedMilestone>) : Array<SerializedClaimedMilestone> {
  return claimedMilestones.map((claimedMilestone) => {
    return {
      name: claimedMilestone.milestone.name,
      playerId: claimedMilestone.player.id,
    } as SerializedClaimedMilestone;
  });
}

export function deserializeClaimedMilestones(
  claimedMilestones: Array<SerializedClaimedMilestone>,
  players: Array<Player>,
  milestones: Array<IMilestone>): Array<ClaimedMilestone> {
  return claimedMilestones.map((element: SerializedClaimedMilestone) => {
    const milestoneName = element.milestone?.name !== undefined ? element.milestone.name : element.name;
    if (milestoneName === undefined) {
      throw new Error('Milestone name not found');
    }
    const milestone: IMilestone | undefined = milestones.find((milestone) => milestone.name === milestoneName);
    if (milestone === undefined) {
      throw new Error(`Milestone ${milestoneName} not found when rebuilding Claimed Milestone`);
    }

    const playerId = element.player?.id !== undefined ? element.player.id : element.playerId;
    if (playerId === undefined) {
      throw new Error(`Player ID not found when rebuilding claimed milestone ${milestoneName}`);
    }
    const player = players.find((player) => player.id === playerId);
    if (player === undefined) {
      throw new Error(`Player ${playerId} not found when rebuilding claimed milestone ${milestoneName}`);
    }

    return {
      milestone: milestone,
      player: player,
    } as ClaimedMilestone;
  });
}
