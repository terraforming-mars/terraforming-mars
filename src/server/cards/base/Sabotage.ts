import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {SelectOption} from '../../inputs/SelectOption';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {all, digit} from '../Options';
import {message} from '../../logs/MessageBuilder';

export class Sabotage extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.SABOTAGE,
      cost: 1,

      metadata: {
        cardNumber: '121',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(3, {all, digit}).nbsp.or(Size.SMALL).nbsp;
          b.minus().steel(4, {all, digit}).br.or(Size.SMALL).nbsp;
          b.minus().megacredits(7, {all});
        }),
        description: 'Remove up to 3 titanium from any player, or 4 steel, or 7 M€.',
      },
    });
  }

  private title(amount: number, type: string, target: IPlayer) {
    return message('Remove ${0} ${1} from ${2}', (b) => b.number(amount).string(type).player(target));
  }

  public override bespokePlay(player: IPlayer) {
    if (player.game.isSoloMode()) return undefined;

    const availableActions = new OrOptions();

    player.getOpponents().forEach((target) => {
      if (target.titanium > 0 && !target.alloysAreProtected()) {
        const amountRemoved = Math.min(3, target.titanium);
        const optionTitle = this.title(amountRemoved, 'titanium', target);
        availableActions.options.push(new SelectOption(optionTitle).andThen(() => {
          target.stock.deduct(Resource.TITANIUM, 3, {log: true, from: player});
          return undefined;
        }));
      }

      if (target.steel > 0 && !target.alloysAreProtected()) {
        const amountRemoved = Math.min(4, target.steel);
        const optionTitle = this.title(amountRemoved, 'steel', target);
        availableActions.options.push(new SelectOption(optionTitle).andThen(() => {
          target.stock.deduct(Resource.STEEL, 4, {log: true, from: player});
          return undefined;
        }));
      }

      if (target.megaCredits > 0) {
        const amountRemoved = Math.min(7, target.megaCredits);
        const optionTitle = this.title(amountRemoved, 'M€', target);
        availableActions.options.push(new SelectOption(optionTitle).andThen(() => {
          target.stock.deduct(Resource.MEGACREDITS, 7, {log: true, from: player});
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

