import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectAmount} from '../../inputs/SelectAmount';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRenderer} from '../render/CardRenderer';
import {multiplier} from '../Options';

export class EnergyMarket extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ENERGY_MARKET,
      tags: [Tags.ENERGY],
      cost: 3,

      metadata: {
        cardNumber: 'X03',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2X M€ to gain X energy.', (eb) => {
            eb.megacredits(2, {multiplier}).startAction.text('x').energy(1);
          }).br;
          b.or().br;
          b.action('Decrease energy production 1 step to gain 8 M€.', (eb) => {
            eb.production((pb) => pb.energy(1)).startAction.megacredits(8);
          });
        }),
      },
    });
  }

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    return player.canAfford(2) || player.getProduction(Resources.ENERGY) >= 1;
  }

  private getEnergyOption(player: Player, availableMC: number): SelectAmount {
    return new SelectAmount(
      'Select amount of energy to gain',
      'Gain energy',
      (amount: number) => {
        if (player.canUseHeatAsMegaCredits) {
          player.addResource(Resources.ENERGY, amount);
          player.game.defer(new SelectHowToPayDeferred(player, (amount * 2)));
        } else {
          player.addResource(Resources.ENERGY, amount);
          player.deductResource(Resources.MEGACREDITS, (amount * 2));
        }

        player.game.log('${0} gained ${1} energy', (b) => b.player(player).number(amount));
        return undefined;
      },
      1,
      Math.floor(availableMC / 2),
    );
  }

  private getMegacreditsOption(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.addResource(Resources.MEGACREDITS, 8);
    player.game.log('${0} decreased energy production 1 step to gain 8 M€', (b) => b.player(player));
    return undefined;
  }

  public action(player: Player) {
    const availableMC = player.spendableMegacredits();
    if (availableMC >= 2 && player.getProduction(Resources.ENERGY) >= 1) {
      return new OrOptions(
        new SelectOption('Spend 2X M€ to gain X energy', 'Spend M€', () => {
          return this.getEnergyOption(player, availableMC);
        }),
        new SelectOption('Decrease energy production 1 step to gain 8 M€', 'Decrease energy', () => {
          return this.getMegacreditsOption(player);
        }),
      );
    } else if (availableMC >= 2) {
      return this.getEnergyOption(player, availableMC);
    } else if (player.getProduction(Resources.ENERGY) >= 1) {
      return this.getMegacreditsOption(player);
    }
    return undefined;
  }
}
