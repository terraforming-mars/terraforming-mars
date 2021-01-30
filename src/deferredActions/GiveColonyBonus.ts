import {Player, PlayerId} from '../Player';
import {Colony} from '../colonies/Colony';
import {DeferredAction, Priority} from './DeferredAction';
import {Multiset} from '../utils/Multiset';

export class GiveColonyBonus implements DeferredAction {
    public priority = Priority.DEFAULT;
    public cb: () => void = () => {};
    private waitingFor: Multiset<PlayerId> = new Multiset<PlayerId>();
    constructor(
        public player: Player,
        public colony: Colony,
    ) {}

    public execute() {
      if (this.colony.colonies.length === 0) {
        this.cb();
        return undefined;
      }

      for (const playerId of this.colony.colonies) {
        this.waitingFor.add(playerId);
      }

      for (const entry of this.waitingFor.entries()) {
        const playerId = entry[0];
        const bonusPlayer = this.player.game.getPlayerById(playerId);
        this.giveColonyBonus(bonusPlayer);
      }

      return undefined;
    }

    private giveColonyBonus(player: Player): void {
      if (this.waitingFor.get(player.id) !== undefined && this.waitingFor.get(player.id)! > 0) {
        this.waitingFor.subtract(player.id);
        const input = this.colony.giveColonyBonus(player, true);
        if (input !== undefined) {
          player.setWaitingFor(input, () => this.giveColonyBonus(player));
        } else {
          this.giveColonyBonus(player);
        }
      } else {
        this.waitingFor.remove(player.id);
        this.doneGettingBonus();
      }
    }

    private doneGettingBonus(): void {
      if (this.waitingFor.entries().length === 0) {
        this.cb();
      }
    }
}
