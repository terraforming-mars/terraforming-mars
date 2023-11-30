import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {Space} from '../boards/Space';
import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {SelectSpace} from '../inputs/SelectSpace';
import {UnderworldExpansion} from './UnderworldExpansion';

export class ExcavateSpaceDeferred extends DeferredAction<Space> {
  constructor(
    player: IPlayer,
    private excavatableSpaces: Array<Space>,
    private title: string = 'Select space to excavate',
  ) {
    super(player, Priority.EXCAVATE_UNDERGROUND_RESOURCE);
  }

  public execute(): PlayerInput {
    return new SelectSpace(this.title,
      this.excavatableSpaces)
      .andThen((space) => {
        UnderworldExpansion.excavate(this.player, space);
        this.cb(space);
        return undefined;
      });
  }
}
