import {IPlayer} from '../IPlayer';
import {PlayerId} from '../../common/Types';
import {IColony} from '../colonies/IColony';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {MultiSet} from 'mnemonist';

export class GiveColonyBonus extends DeferredAction {
  private waitingFor = new MultiSet<PlayerId>();
  private playersWithBonuses = new Set<PlayerId>();
  private cbRun: () => void = () => {};

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
    this.cbRun = cb;
    if (this.colony.colonies.length === 0) {
      this.doneGettingBonus();
      return undefined;
    }

    for (const playerId of this.colony.colonies) {
      this.waitingFor.add(playerId);
      this.playersWithBonuses.add(playerId);
    }

    for (const playerId of this.waitingFor.keys()) {
      const player = this.player.game.getPlayerById(playerId);
      this.giveColonyBonus(player);
    }
  }

  private giveColonyBonus(player: IPlayer): void {
    if (this.waitingFor.get(player.id) ?? 0 > 0) {
      this.waitingFor.remove(player.id);
      const input = this.colony.giveColonyBonus(player, true);
      if (input !== undefined) {
        player.setWaitingFor(input, () => this.giveColonyBonus(player));
      } else {
        this.giveColonyBonus(player);
      }
    } else {
      this.playersWithBonuses.delete(player.id);
      this.doneGettingBonus();
    }
  }

  private doneGettingBonus(): void {
    if (this.playersWithBonuses.size === 0) {
      this.execute();
      this.cbRun();
    }
  }
}
