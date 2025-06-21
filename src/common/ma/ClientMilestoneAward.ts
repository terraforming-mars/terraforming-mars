import {MilestoneName} from './MilestoneName';
import {AwardName} from './AwardName';
import {Expansion} from '../cards/GameModule';

type ClientMA<T> = {
  name: T;
  description: string;
  requirements: Expansion | undefined;
}

export type ClientMilestone = ClientMA<MilestoneName>;
export type ClientAward = ClientMA<AwardName>;
