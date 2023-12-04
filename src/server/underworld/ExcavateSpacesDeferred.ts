import {IPlayer} from '../IPlayer';
import {DeferredAction, Priority, SimpleDeferredAction} from '../deferredActions/DeferredAction';
import {SelectSpace} from '../inputs/SelectSpace';
import {UnderworldExpansion} from '../underworld/UnderworldExpansion';

export class ExcavateSpacesDeferred extends DeferredAction {
  private nth: number = 1;
  constructor(
    player: IPlayer,
    public count: number,
    private ignorePlacementRestrictions: boolean = false,
  ) {
    super(player, Priority.EXCAVATE_UNDERGROUND_RESOURCE);
  }

  private selectSpace(): void {
    const prefix = 'Select space to excavate';
    const title = prefix + (this.count > 1 ? ` (${this.nth} of ${this.count})` : '');
    this.player.game.defer(new SimpleDeferredAction(this.player, () => {
      return new SelectSpace(title,
        UnderworldExpansion.excavatableSpaces(this.player, this.ignorePlacementRestrictions))
        .andThen((space) => {
          UnderworldExpansion.excavate(this.player, space);
          this.nth++;
          if (this.nth <= this.count) {
            this.selectSpace();
          }
          return undefined;
        });
    }));
  }

  public execute(): undefined {
    if (this.count > 0) {
      this.selectSpace();
    }
    return undefined;
  }
}
