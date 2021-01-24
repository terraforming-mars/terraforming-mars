import {Player, PlayerId} from '../Player';
import {Colony} from '../colonies/Colony';
import {Game} from '../Game';
import {DeferredAction, Priority} from './DeferredAction';
import {Multiset} from '../utils/Multiset';
import {NoopCallback} from '../server/callbacks/NoopCallback';
import {PlayerCallback} from '../server/PlayerCallback';
import {PlayerCallbackId} from '../server/PlayerCallbackId';

export class GiveColonyBonus implements DeferredAction {
    private static readonly GiveColonyBonusAgain = class implements PlayerCallback {
      public readonly id = PlayerCallbackId.GIVE_COLONY_BONUS_AGAIN;
      public game: Game;
      constructor(
        public player: Player,
        public action: GiveColonyBonus) {
        this.game = player.game;
      }
      public execute() {
        this.action.giveColonyBonus(this.player);
      }
    }

    public priority = Priority.DEFAULT;
    public cb: PlayerCallback;
    private waitingFor: Multiset<PlayerId> = new Multiset<PlayerId>();
    constructor(
        public player: Player,
        public colony: Colony,
    ) {
      this.cb = new NoopCallback(player.game);
    }

    public execute() {
      if (this.colony.colonies.length === 0) {
        this.cb.execute();
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

    public giveColonyBonus(player: Player): void {
      if (this.waitingFor.get(player.id) !== undefined && this.waitingFor.get(player.id)! > 0) {
        this.waitingFor.subtract(player.id);
        const input = this.colony.giveColonyBonus(player, true);
        if (input !== undefined) {
          player.setWaitingFor(input, new GiveColonyBonus.GiveColonyBonusAgain(player, this));
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
        this.cb.execute();
      }
    }
}
