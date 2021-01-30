import {IAward} from './IAward';
import {Player, PlayerId} from '../Player';

export interface FundedAward {
  award: IAward;
  player: Player;
}

export interface SerializedFundedAward {
  name?: string;
  playerId?: PlayerId;
}

export function serializeFundedAwards(fundedAwards: Array<FundedAward>) : Array<SerializedFundedAward> {
  return fundedAwards.map((fundedAward) => {
    return {
      name: fundedAward.award.name,
      playerId: fundedAward.player.id,
    };
  });
}

export function deserializeFundedAwards(
  fundedAwards: Array<SerializedFundedAward>,
  players: Array<Player>,
  awards: Array<IAward>): Array<FundedAward> {
  return fundedAwards.map((element: SerializedFundedAward) => {
    const awardName = element.name;
    if (awardName === undefined) {
      throw new Error('Award name not found');
    }
    const award: IAward | undefined = awards.find((award) => award.name === awardName);
    if (award === undefined) {
      throw new Error(`Award ${awardName} not found when rebuilding Funded Award`);
    }

    const playerId = element.playerId;
    if (playerId === undefined) {
      throw new Error(`Player ID not found when rebuilding Funded Award ${awardName}`);
    }
    const player = players.find((player) => player.id === playerId);
    if (player === undefined) {
      throw new Error(`Player ${playerId} not found when rebuilding Funded Award ${awardName}`);
    }

    return {award, player};
  });
}
