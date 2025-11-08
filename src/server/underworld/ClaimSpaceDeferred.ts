import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {Space} from '../boards/Space';
import {DeferredAction} from '../deferredActions/DeferredAction';
import {Priority} from '../deferredActions/Priority';
import {SelectSpace} from '../inputs/SelectSpace';
import {UnderworldExpansion} from './UnderworldExpansion';

export class ClaimSpaceDeferred extends DeferredAction<Space> {
  constructor(
    player: IPlayer,
    private claimableSpaces: ReadonlyArray<Space>,
    private title: string = 'Select space to excavate',
  ) {
    super(player, Priority.EXCAVATE_UNDERGROUND_RESOURCE);
  }

  public execute(): PlayerInput {
    return new SelectSpace(this.title,
      this.claimableSpaces)
      .andThen((space) => {
        UnderworldExpansion.claim(this.player, space);
        this.cb(space);
        return undefined;
      });
  }
}
