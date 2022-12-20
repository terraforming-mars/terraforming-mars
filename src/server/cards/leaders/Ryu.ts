import { CardName } from '../../../common/cards/CardName';
import { CardType } from '../../../common/cards/CardType';
import { Player } from '../../Player';
import { PlayerInput } from '../../PlayerInput';
import { Card } from '../Card';
import { CardRenderer } from '../render/CardRenderer';
import { LeaderCard } from './LeaderCard';

import {OrOptions} from '../../inputs/OrOptions';
import {Resources} from '../../../common/Resources';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectAmount} from '../../inputs/SelectAmount';

export class Ryu extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.RYU,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L30',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br;
          b.text('SWAP X+2').production((pb) => pb.wild(1));
          b.br.br;
        }),
        description: 'Once per game, swap up to X+2 of ANY two productions, where X is the current generation number.',
      },
    });
  }

  public isDisabled = false;

  public override play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    const resources = [Resources.MEGACREDITS, Resources.STEEL, Resources.TITANIUM, Resources.PLANTS, Resources.ENERGY, Resources.HEAT];
    if (resources.some((res) => this.productionIsDecreasable(player, res)) === false) return false;

    return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const resources = [Resources.MEGACREDITS, Resources.STEEL, Resources.TITANIUM, Resources.PLANTS, Resources.ENERGY, Resources.HEAT];
    const choices = new OrOptions();

    resources.filter((r) => this.productionIsDecreasable(player, r)).forEach((resourceToDecrease) => {
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
              resources.filter((res) => res !== resourceToDecrease)
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
          true
        );
      });

      choices.options.push(selectOption);
    });

    this.isDisabled = true;
    return choices;
  }

  private productionIsDecreasable(player: Player, resource: Resources): boolean {
    let min_production = 0;
    if (resource === Resources.MEGACREDITS) min_production -= 5;
    return player.production.get(resource) > min_production;
  }
}
