import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectAmount} from '../../inputs/SelectAmount';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {CardRenderer} from '../render/CardRenderer';

export class EnergyMarket extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ENERGY_MARKET,
      tags: [Tag.POWER],
      cost: 3,

      metadata: {
        cardNumber: 'X03',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2X M€ to gain X energy.', (eb) => {
            eb.megacredits(1, {text: '2x'}).startAction.text('x').energy(1);
          }).br;
          b.or().br;
          b.action('Decrease energy production 1 step to gain 8 M€.', (eb) => {
            eb.production((pb) => pb.energy(1)).startAction.megacredits(8);
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.canAfford(2) || player.production.energy >= 1;
  }

  private getEnergyOption(player: IPlayer, availableMC: number): SelectAmount {
    return new SelectAmount(
      'Select amount of energy to gain', 'Gain energy', 1, Math.floor(availableMC / 2))
      .andThen((amount) => {
        player.game.defer(new SelectPaymentDeferred(player, amount * 2))
          .andThen(() => player.stock.add(Resource.ENERGY, amount, {log: true}));
        return undefined;
      });
  }

  private getMegacreditsOption(player: IPlayer) {
    player.production.add(Resource.ENERGY, -1);
    player.stock.add(Resource.MEGACREDITS, 8);
    player.game.log('${0} decreased energy production 1 step to gain 8 M€', (b) => b.player(player));
    return undefined;
  }

  public action(player: IPlayer) {
    const availableMC = player.spendableMegacredits();
    if (availableMC >= 2 && player.production.energy >= 1) {
      return new OrOptions(
        new SelectOption('Spend 2X M€ to gain X energy', 'Spend M€').andThen(() => {
          return this.getEnergyOption(player, availableMC);
        }),
        new SelectOption('Decrease energy production 1 step to gain 8 M€', 'Decrease energy').andThen(() => {
          return this.getMegacreditsOption(player);
        }),
      );
    } else if (availableMC >= 2) {
      return this.getEnergyOption(player, availableMC);
    } else if (player.production.energy >= 1) {
      return this.getMegacreditsOption(player);
    }
    return undefined;
  }
}
