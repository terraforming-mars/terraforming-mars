import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {SpaceId} from '../../common/Types';

const BORDER_SPACE_IDS: ReadonlyArray<SpaceId> = [
  '03', '04', '05', '06', '07',
  '08', '13',
  '14', '20',
  '21', '28',
  '29', '37',
  '38', '45',
  '46', '52',
  '53', '58',
  '59', '60', '61', '62', '63',
] as const;

export class Suburbian implements IAward {
  public readonly name = 'Suburbian';
  public readonly description = 'Own the most tiles along the border of the map';
  public getScore(player: IPlayer): number {
    const board = player.game.board;
    const borderSpaces = BORDER_SPACE_IDS.map((spaceId) => board.getSpaceOrThrow(spaceId));
    const playerOwnedSpaces = borderSpaces.filter((space) => space.player === player && space.tile !== undefined);

    return playerOwnedSpaces.length;
  }
}
