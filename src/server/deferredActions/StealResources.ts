import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction, Priority} from './DeferredAction';
import {CardName} from '../../common/cards/CardName';

export class StealResources extends DeferredAction {
  constructor(
    player: IPlayer,
    public resource: Resource,
    public count: number = 1,
    public title: string = 'Select player to steal up to ' + count + ' ' + resource + ' from',
  ) {
    super(player, Priority.ATTACK_OPPONENT);
  }

  public execute() {
    if (this.player.game.isSoloMode()) {
      this.player.stock.add(this.resource, this.count);
      this.player.resolveInsuranceInSoloGame();
      return undefined;
    }

    let candidates: Array<IPlayer> = this.player.game.getPlayers().filter((p) => p.id !== this.player.id && p.stock.get(this.resource) > 0);
    if (this.resource === Resource.PLANTS) {
      candidates = candidates.filter((p) => !p.plantsAreProtected());
    }
    if (this.resource === Resource.STEEL || this.resource === Resource.TITANIUM) {
      candidates = candidates.filter((p) => !p.alloysAreProtected());
    }

    if (candidates.length === 0) {
      return undefined;
    }

    const stealOptions = candidates.map((candidate) => {
      let qtyToSteal = Math.min(candidate.stock.get(this.resource), this.count);

      // Botanical Experience hook.
      if (this.resource === Resource.PLANTS && candidate.cardIsInEffect(CardName.BOTANICAL_EXPERIENCE)) {
        qtyToSteal = Math.ceil(qtyToSteal / 2);
      }

      return new SelectOption(
        'Steal ' + qtyToSteal + ' ' + this.resource + ' from ' + candidate.name,
        'Steal',
        () => {
          candidate.stock.deduct(this.resource, qtyToSteal, {log: true, from: this.player, stealing: true});
          this.player.stock.add(this.resource, qtyToSteal);
          return undefined;
        },
      );
    });

    return new OrOptions(
      ...stealOptions,
      new SelectOption('Do not steal', 'Confirm', () => {
        return undefined;
      }),
    );
  }
}
