import {UndergroundResourceToken} from '@/common/underworld/UndergroundResourceToken';
import {Space} from '@/server/boards/Space';

export type UnderworldData = {
  tokens: Array<UndergroundResourceToken>;
};

export type TokenSources = {
  spaces: Array<Space>,
  tokens: Array<UndergroundResourceToken>,
}
