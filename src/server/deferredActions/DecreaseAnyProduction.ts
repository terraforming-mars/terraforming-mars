import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {Message} from '../../common/logs/Message';
import {message} from '../logs/MessageBuilder';

export type Options = {
  count: number,
  stealing?: boolean
}

export class DecreaseAnyProduction extends DeferredAction<boolean> {
  constructor(
    player: IPlayer,
    public resource: Resource,
    public options: Options = {
      count: 1,
      stealing: false,
    },
    public title: string | Message = message('Select player to decrease ${0} production by ${1} step(s)', (b) => b.string(resource).number(options.count)),
  ) {
    super(player, Priority.ATTACK_OPPONENT);
  }

  private attack(target: IPlayer): void {
    target.maybeBlockAttack(this.player, (proceed: boolean) => {
      if (proceed) {
        target.production.add(this.resource, -this.options.count, {log: true, from: this.player, stealing: this.options.stealing});
      }
      this.cb(proceed);
      return undefined;
    });
  }

  public execute() {
    if (this.player.game.isSoloMode()) {
      this.player.resolveInsuranceInSoloGame();
      this.cb(true);
    } else {
      const targets = this.player.game.getPlayers().filter((p) => p.canHaveProductionReduced(this.resource, this.options.count, this.player));

      if (targets.length === 0) {
        this.cb(false);
        return undefined;
      }
      if (targets.length > 0) {
        if (targets.length > 1 || targets[0] === this.player) {
          return new SelectPlayer(targets, this.title, 'Decrease')
            .andThen((candidate) => {
              this.attack(candidate);
              return undefined;
            });
        } else {
          this.attack(targets[0]);
        }
      }
    }

    return undefined;
  }
}
