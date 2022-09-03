import {SpaceId} from '../Types';

export function isMoonSpace(spaceId: SpaceId): boolean {
  return spaceId.startsWith('m');
}

export function isMarsSpace(spaceId: SpaceId): boolean {
  return !isMoonSpace(spaceId);
}
