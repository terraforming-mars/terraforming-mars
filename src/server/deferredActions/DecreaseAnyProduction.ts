import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {DeferredAction, Priority} from './DeferredAction';
import {Message} from '../../common/logs/Message';
import {message} from '../logs/MessageBuilder';

export type Options = {
  count: number,
  stealing?: boolean
}

export class DecreaseAnyProduction extends DeferredAction {
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

  public execute() {
    if (this.player.game.isSoloMode()) {
      this.player.resolveInsuranceInSoloGame();
    } else {
      const candidates: Array<IPlayer> = this.player.game.getPlayers().filter((p) => p.canHaveProductionReduced(this.resource, this.options.count, this.player));

      if (candidates.length > 0) {
        if (candidates.length > 1 || candidates[0] === this.player) {
          return new SelectPlayer(candidates, this.title, 'Decrease')
            .andThen((candidate) => {
              candidate.production.add(this.resource, -this.options.count, {log: true, from: this.player, stealing: this.options.stealing});
              this.cb(undefined);
              return undefined;
            });
        } else {
          candidates[0].production.add(this.resource, -this.options.count, {log: true, from: this.player, stealing: this.options.stealing});
        }
      }
    }

    this.cb(undefined);
    return undefined;
  }
}
