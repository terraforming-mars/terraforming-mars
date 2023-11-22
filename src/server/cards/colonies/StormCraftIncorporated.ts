import {ActiveCorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {AndOptions} from '../../inputs/AndOptions';
import {SelectAmount} from '../../inputs/SelectAmount';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {PlayerInput} from '../../PlayerInput';
import {Resource} from '../../../common/Resource';
import {message} from '../../logs/MessageBuilder';

export class StormCraftIncorporated extends ActiveCorporationCard {
  constructor() {
    super({
      name: CardName.STORMCRAFT_INCORPORATED,
      tags: [Tag.JOVIAN],
      startingMegaCredits: 48,
      resourceType: CardResource.FLOATER,

      action: {
        addResourcesToAnyCard: {type: CardResource.FLOATER, count: 1, autoSelect: true},
      },

      metadata: {
        cardNumber: 'R29',
        description: 'You start with 48 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(48);
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.action('Add a floater to ANY card.', (eb) => {
              eb.empty().startAction.floaters(1).asterix();
            });
            ce.vSpace();
            ce.effect('Floaters on this card may be used as 2 heat each.', (eb) => {
              eb.startEffect.floaters(1).equals().heat(2);
            });
          });
        }),
      },
    });
  }

  public spendHeat(player: IPlayer, targetAmount: number,
    cb: () => (undefined | PlayerInput) = () => undefined): AndOptions {
    let heatAmount: number;
    let floaterAmount: number;

    const options = new AndOptions(
      new SelectAmount('Heat', 'Spend heat', 0, Math.min(player.heat, targetAmount))
        .andThen((amount) => {
          heatAmount = amount;
          return undefined;
        }),
      new SelectAmount('Stormcraft Incorporated Floaters (2 heat each)', 'Spend floaters',
        0, Math.min(this.resourceCount, Math.ceil(targetAmount / 2)))
        .andThen((amount) => {
          floaterAmount = amount;
          return undefined;
        })).andThen(() => {
      if (heatAmount + (floaterAmount * 2) < targetAmount) {
        throw new Error(`Need to pay ${targetAmount} heat`);
      }
      if (heatAmount > 0 && heatAmount - 1 + (floaterAmount * 2) >= targetAmount) {
        throw new Error('You cannot overspend heat');
      }
      if (floaterAmount > 0 && heatAmount + ((floaterAmount - 1) * 2) >= targetAmount) {
        throw new Error('You cannot overspend floaters');
      }
      player.removeResourceFrom(this, floaterAmount);
      player.stock.deduct(Resource.HEAT, heatAmount);
      return cb();
    });
    options.title = message('Select how to spend ${0} heat', (b) => b.number(targetAmount));
    return options;
  }
}
