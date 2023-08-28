import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {DeferredAction, Priority} from './DeferredAction';

export type Options = {
  count: number,
  stealing?: boolean
}

export class DecreaseAnyProduction extends DeferredAction {
  private cb: () => void = () => {};

  constructor(
    player: IPlayer,
    public resource: Resource,
    public options: Options = {
      count: 1,
      stealing: false,
    },
    public title: string = 'Select player to decrease ' + resource + ' production by ' + options.count + ' step(s)',
  ) {
    super(player, Priority.ATTACK_OPPONENT);
  }

  public andThen(cb: () => void) {
    this.cb = cb;
    return this;
  }

  public execute() {
    if (this.player.game.isSoloMode()) {
      this.player.resolveInsuranceInSoloGame();
      this.cb();
      return undefined;
    }

    const candidates: Array<IPlayer> = this.player.game.getPlayers().filter((p) => p.canHaveProductionReduced(this.resource, this.options.count, this.player));

    if (candidates.length === 0) {
      this.cb();
      return undefined;
    }

    if (candidates.length === 1 && candidates[0] !== this.player) {
      candidates[0].production.add(this.resource, -this.options.count, {log: true, from: this.player, stealing: this.options.stealing});
      this.cb();
      return undefined;
    }

    return new SelectPlayer(
      candidates,
      this.title,
      'Decrease',
      (found: IPlayer) => {
        found.production.add(this.resource, -this.options.count, {log: true, from: this.player, stealing: this.options.stealing});
        this.cb();
        return undefined;
      },
    );
  }
}
