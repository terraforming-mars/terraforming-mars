import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {all, digit} from '../Options';
import {IPlayer} from '../../IPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {Resource} from '../../../common/Resource';
import {SelectOption} from '../../inputs/SelectOption';
import {message} from '../../logs/MessageBuilder';

export class RecklessDetonation extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.RECKLESS_DETONATION,
      cost: 1,

      requirements: {corruption: 2},

      behavior: {
        underworld: {excavate: 1},
      },

      metadata: {
        cardNumber: 'U06',
        renderData: CardRenderer.builder((b) => {
          b.excavate(1).minus().steel(3, {digit, all}).asterix().or().titanium(2, {digit, all}).asterix();
        }),
        description: 'Requires 2 corruption. Excavate an underground resource. Remove up to 3 steel or 2 titanium from another player.',
      },
    });
  }

  private title(amount: number, type: string, target: IPlayer) {
    return message('Remove ${0} ${1} from ${2}', (b) => b.number(amount).string(type).player(target));
  }

  public override bespokePlay(player: IPlayer) {
    if (player.game.isSoloMode()) return undefined;

    const availablePlayerTargets = player.game.getPlayers().filter((p) => p.id !== player.id);
    const availableActions = new OrOptions();

    availablePlayerTargets.forEach((target) => {
      if (target.titanium > 0 && !target.alloysAreProtected()) {
        const amountRemoved = Math.min(2, target.titanium);
        const optionTitle = this.title(amountRemoved, 'titanium', target);
        availableActions.options.push(new SelectOption(optionTitle).andThen(() => {
          target.maybeBlockAttack(player, (proceed) => {
            if (proceed) {
              target.stock.deduct(Resource.TITANIUM, 2, {log: true, from: player});
            }
            return undefined;
          });
          return undefined;
        }));
      }

      if (target.steel > 0 && !target.alloysAreProtected()) {
        const amountRemoved = Math.min(3, target.steel);
        const optionTitle = this.title(amountRemoved, 'steel', target);
        availableActions.options.push(new SelectOption(optionTitle).andThen(() => {
          target.maybeBlockAttack(player, (proceed) => {
            if (proceed) {
              target.stock.deduct(Resource.STEEL, 3, {log: true, from: player});
            }
            return undefined;
          });
          return undefined;
        }));
      }
    });

    if (availableActions.options.length > 0) {
      availableActions.options.push(new SelectOption('Do not remove resource').andThen(() => {
        return undefined;
      }));
      return availableActions;
    }
    return undefined;
  }
}
