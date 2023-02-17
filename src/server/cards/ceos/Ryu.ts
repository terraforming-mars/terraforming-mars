import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {OrOptions} from '../../inputs/OrOptions';
import {ALL_RESOURCES, Resources} from '../../../common/Resources';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectAmount} from '../../inputs/SelectAmount';

export class Ryu extends CeoCard {
  constructor() {
    super({
      name: CardName.RYU,
      metadata: {
        cardNumber: 'L30',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br;
          b.text('SWAP X+2').production((pb) => pb.wild(1));
          b.br.br;
        }),
        description: 'Once per game, swap up to X+2 units of production between two resources, where X is the current generation number.',
      },
    });
  }

  public override canAct(player: Player): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    // I'm not using player.canReduceAnyProduction here as that cares about solo players
    return player.production.megacredits +
              player.production.steel +
              player.production.titanium +
              player.production.plants +
              player.production.energy +
              player.production.heat > -5;
  }

  public action(player: Player): PlayerInput | undefined {
    const choices = new OrOptions();

    ALL_RESOURCES.filter((r) => this.productionIsDecreasable(player, r)).forEach((resourceToDecrease) => {
      const selectOption = new SelectOption(`Decrease ${resourceToDecrease} production`, 'Select', () => {
        // M€ production can go down to -5
        let decreasable = player.production.get(resourceToDecrease);
        if (resourceToDecrease === Resources.MEGACREDITS) decreasable += 5;
        const maxDecreasableAmt = Math.min(player.game.generation + 2, decreasable);

        return new SelectAmount(
          `Select amount of ${resourceToDecrease} production to decrease`,
          'Decrease',
          (amount: number) => {
            const productionToIncrease =
              ALL_RESOURCES.filter((res) => res !== resourceToDecrease)
                .map((res) => new SelectOption(`Increase ${res} production`, 'Select', () => {
                  player.production.add(resourceToDecrease, -amount, {log: true});
                  // player.production.adjust()
                  player.production.add(res, amount, {log: true});
                  return undefined;
                }));

            return new OrOptions(...productionToIncrease);
          },
          1,
          maxDecreasableAmt,
          true,
        );
      });

      choices.options.push(selectOption);
    });

    this.isDisabled = true;
    return choices;
  }

  private productionIsDecreasable(player: Player, resource: Resources): boolean {
    let minProduction = 0;
    if (resource === Resources.MEGACREDITS) minProduction -= 5;
    return player.production.get(resource) > minProduction;
  }
}
