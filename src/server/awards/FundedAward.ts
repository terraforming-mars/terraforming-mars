import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {PlayerId} from '../../common/Types';
import {AwardName} from '../../common/ma/AwardName';

export type FundedAward = {
  award: IAward;
  player: IPlayer;
}

export type SerializedFundedAward = {
  name?: AwardName;
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
  players: Array<IPlayer>,
  awards: Array<IAward>): Array<FundedAward> {
  // Remove duplicates
  const aw = new Set<AwardName>();
  const filtered = [];
  for (const fundedAward of fundedAwards) {
    const name = fundedAward.name;
    if (name === undefined) {
      throw new Error('Award name not found');
    }
    const playerId = fundedAward.playerId;
    if (playerId === undefined) {
      throw new Error(`Player ID not found when rebuilding funded award ${name}`);
    }

    if (aw.has(name)) {
      console.error('Found duplicate award: ' + name);
      continue;
    } else {
      filtered.push({name, playerId});
      aw.add(name);
    }
  }

  return filtered.map((element: SerializedFundedAward) => {
    const awardName = element.name;
    const award: IAward | undefined = awards.find((award) => award.name === awardName);
    if (award === undefined) {
      throw new Error(`Award ${awardName} not found when rebuilding Funded Award`);
    }

    const playerId = element.playerId;
    const player = players.find((player) => player.id === playerId);
    if (player === undefined) {
      throw new Error(`Player ${playerId} not found when rebuilding Funded Award ${awardName}`);
    }

    return {award, player};
  });
}
