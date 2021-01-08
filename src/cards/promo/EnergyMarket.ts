import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {Game} from '../../Game';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectAmount} from '../../inputs/SelectAmount';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class EnergyMarket implements IProjectCard {
  public name = CardName.ENERGY_MARKET;
  public cost = 3;
  public tags = [Tags.ENERGY];
  public cardType = CardType.ACTIVE;

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    const availableMC = (player.canUseHeatAsMegaCredits) ? player.getResource(Resources.MEGACREDITS) + player.getResource(Resources.HEAT) : player.getResource(Resources.MEGACREDITS);
    return availableMC >= 2 || player.getProduction(Resources.ENERGY) >= 1;
  }

  private getEnergyOption(player: Player, game: Game, availableMC: number): SelectAmount {
    return new SelectAmount(
      'Select amount of energy to gain',
      'Gain energy',
      (amount: number) => {
        if (player.canUseHeatAsMegaCredits) {
          player.setResource(Resources.ENERGY, amount);
          game.defer(new SelectHowToPayDeferred(player, (amount * 2)));
        } else {
          player.setResource(Resources.ENERGY, amount);
          player.setResource(Resources.MEGACREDITS, -(amount * 2));
        }

        game.log('${0} gained ${1} energy', (b) => b.player(player).number(amount));
        return undefined;
      },
      1,
      Math.floor(availableMC / 2),
    );
  }

  private getMegacreditsOption(player: Player, game: Game) {
    player.addProduction(Resources.ENERGY, -1);
    player.setResource(Resources.MEGACREDITS, 8);
    game.log('${0} decreased energy production 1 step to gain 8 MC', (b) => b.player(player));
    return undefined;
  }

  public action(player: Player, game: Game) {
    const availableMC = player.spendableMegacredits();
    if (availableMC >= 2 && player.getProduction(Resources.ENERGY) >= 1) {
      return new OrOptions(
        new SelectOption('Spend 2X MC to gain X energy', 'Spend MC', () => {
          return this.getEnergyOption(player, game, availableMC);
        }),
        new SelectOption('Decrease energy production 1 step to gain 8 MC', 'Decrease energy', () => {
          return this.getMegacreditsOption(player, game);
        }),
      );
    } else if (availableMC >= 2) {
      return this.getEnergyOption(player, game, availableMC);
    } else if (player.getProduction(Resources.ENERGY) >= 1) {
      return this.getMegacreditsOption(player, game);
    }
    return undefined;
  }

  public metadata: CardMetadata = {
    cardNumber: 'X03',
    renderData: CardRenderer.builder((b) => {
      b.action('Spend 2X MC to gain X energy.', (eb) => {
        eb.megacredits(2).multiplier.startAction.text('x').energy(1);
      }).br;
      b.or().br;
      b.action('Decrease energy production 1 step to gain 8 MC.', (eb) => {
        eb.production((pb) => pb.energy(1)).startAction.megacredits(8);
      });
    }),
  };
}
