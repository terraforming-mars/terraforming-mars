import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {SelectSpace} from '../inputs/SelectSpace';
import {Tile} from '../Tile';
import {IPlayer} from '../IPlayer';
import {MoonExpansion} from './MoonExpansion';
import {Message} from '@/common/logs/Message';
import {newMessage} from '../logs/MessageBuilder';

export class PlaceSpecialMoonTile extends DeferredAction {
  constructor(
    player: IPlayer,
    public tile: Tile,
    public title: string | Message = newMessage('Select a space on The Moon for ${0}', (b) => b.tileType(tile.tileType)),
  ) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const moonData = MoonExpansion.moonData(this.player.game);
    const spaces = moonData.moon.getAvailableSpacesOnLand(this.player);

    if (spaces.length === 0) {
      return undefined;
    }
    return new SelectSpace(this.title, spaces)
      .andThen((space) => {
        MoonExpansion.addTile(this.player, space.id, this.tile);
        return undefined;
      });
  }
}
