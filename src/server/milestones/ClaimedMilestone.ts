
import {IPlayer} from '../IPlayer';
import {PlayerId} from '../../common/Types';
import {IMilestone} from './IMilestone';
import {MilestoneName} from '../../common/ma/MilestoneName';

export type ClaimedMilestone = {
  milestone: IMilestone;
  player: IPlayer;
}

export type SerializedClaimedMilestone = {
  name?: MilestoneName;
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
  players: Array<IPlayer>,
  milestones: Array<IMilestone>): Array<ClaimedMilestone> {
  // Remove duplicates
  const ms = new Set<MilestoneName>();
  const filtered = [];
  for (const claimedMilestone of claimedMilestones) {
    const name = claimedMilestone.name;
    if (name === undefined) {
      throw new Error('Milestone name not found');
    }
    const playerId = claimedMilestone.playerId;
    if (playerId === undefined) {
      throw new Error(`Player ID not found when rebuilding claimed milestone ${name}`);
    }

    if (ms.has(name)) {
      console.error('Found duplicate milestone: ' + name);
      continue;
    } else {
      filtered.push({name, playerId});
      ms.add(name);
    }
  }

  return filtered.map((element) => {
    const milestoneName = element.name;
    const milestone: IMilestone | undefined = milestones.find((milestone) => milestone.name === milestoneName);
    if (milestone === undefined) {
      throw new Error(`Milestone ${milestoneName} not found when rebuilding Claimed Milestone`);
    }

    const playerId = element.playerId;
    const player = players.find((player) => player.id === playerId);
    if (player === undefined) {
      throw new Error(`Player ${playerId} not found when rebuilding claimed milestone ${milestoneName}`);
    }

    return {milestone, player};
  });
}
