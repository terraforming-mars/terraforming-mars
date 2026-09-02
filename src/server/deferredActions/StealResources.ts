import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {CardName} from '../../common/cards/CardName';
import {Message} from '../../common/logs/Message';
import {message} from '../logs/MessageBuilder';

export class StealResources extends DeferredAction {
  constructor(
    player: IPlayer,
    public resource: Resource,
    public count: number = 1,
    public title: string | Message = message('Select player to steal up to ${0} ${1} from', (b) => b.number(count).string(resource)),
    public mandatory: boolean = false,
  ) {
    super(player, Priority.ATTACK_OPPONENT);
  }

  public static getCandidates(
    player: IPlayer,
    resource: Resource,
    count: number,
    mandatory: boolean = false): Array<IPlayer> {
    return player.opponents.filter((p) => {
      const minimum = mandatory ? count : 1;
      const amt = p.stock.get(resource);
      if (amt < minimum) {
        return false;
      }
      if (resource === Resource.PLANTS) {
        if (p.plantsAreProtected()) {
          return false;
        }
        if (p.tableau.has(CardName.BOTANICAL_EXPERIENCE)) {
          if (amt < minimum * 2) {
            return false;
          }
        }
      }
      if ((resource === Resource.STEEL || resource === Resource.TITANIUM)) {
        if (p.alloysAreProtected()) {
          return false;
        }
      }
      return true;
    });
  }

  public execute() {
    if (this.player.game.isSoloMode()) {
      this.player.stock.add(this.resource, this.count);
      this.player.resolveInsuranceInSoloGame();
      return undefined;
    }

    const candidates = StealResources.getCandidates(this.player, this.resource, this.count, this.mandatory);

    if (candidates.length === 0) {
      return undefined;
    }

    const stealOptions = candidates.map((target) => {
      let qtyToSteal = Math.min(target.stock.get(this.resource), this.count);

      // Botanical Experience hook.
      if (this.resource === Resource.PLANTS && target.tableau.has(CardName.BOTANICAL_EXPERIENCE)) {
        qtyToSteal = Math.ceil(qtyToSteal / 2);
      }

      return new SelectOption(
        message('Steal ${0} ${1} from ${2}', (b) => b.number(qtyToSteal).string(this.resource).player(target)),
        'Steal')
        .andThen(() => {
          target.attack(this.player, this.resource, qtyToSteal, {log: true, stealing: true});
          return undefined;
        });
    });

    if (!this.mandatory) {
      stealOptions.push(new SelectOption('Do not steal'));
    }
    return new OrOptions(...stealOptions);
  }
}
