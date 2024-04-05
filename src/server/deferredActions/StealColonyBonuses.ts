import {IPlayer} from '../IPlayer';
import {IColony} from '../colonies/IColony';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';

export class StealColonyBonuses extends DeferredAction {
  /** Tracks the amount bonuses the player has 'stolen' */
  private bonusesRecived = 0;

  constructor(
    player: IPlayer,
    public colony: IColony,
  ) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    this.cb(undefined);
    return undefined;
  }

  public override run(cb: () => void): void {
    if (this.colony.colonies.length === this.bonusesRecived) {
      this.execute();
      cb();
      return undefined;
    }

    this.bonusesRecived++;
    const input = this.colony.giveColonyBonus(this.player, true);
    if (input !== undefined) {
      this.player.setWaitingFor(input, () => this.run(cb));
    } else {
      this.run(cb);
    }
  }
}
