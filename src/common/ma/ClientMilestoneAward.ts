import {MilestoneName} from './MilestoneName';
import {AwardName} from './AwardName';
import {Expansion} from '../cards/GameModule';
import {BoardName} from '../boards/BoardName';

type ClientMA<T> = {
  name: T;
  description: string;
  requirements: Expansion | undefined;
  automaDescription: string | undefined;
  automaMapDescriptions: Partial<Record<BoardName, string>> | undefined;
}

export type ClientMilestone = ClientMA<MilestoneName>;
export type ClientAward = ClientMA<AwardName>;
