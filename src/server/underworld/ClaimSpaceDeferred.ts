import {IPlayer} from '@/server/IPlayer';
import {PlayerInput} from '@/server/PlayerInput';
import {Space} from '@/server/boards/Space';
import {DeferredAction} from '@/server/deferredActions/DeferredAction';
import {Priority} from '@/server/deferredActions/Priority';
import {SelectSpace} from '@/server/inputs/SelectSpace';
import {UnderworldExpansion} from '@/server/underworld/UnderworldExpansion';

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
