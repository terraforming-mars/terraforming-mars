import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {OrOptions} from '../../inputs/OrOptions';
import {ALL_RESOURCES, Resource} from '../../../common/Resource';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectAmount} from '../../inputs/SelectAmount';
import {message} from '../../logs/MessageBuilder';
import {PRODUCTION_MINIMUMS} from '../../../common/constants';
import {Units} from '../../../common/Units';
import {sum} from '../../../common/utils/utils';

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

  public override canAct(player: IPlayer): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    return player.production.megacredits +
              player.production.steel +
              player.production.titanium +
              player.production.plants +
              player.production.energy +
              player.production.heat > sum(Units.values(PRODUCTION_MINIMUMS));
  }

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    const choices = new OrOptions();

    ALL_RESOURCES.filter((r) => this.productionIsDecreasable(player, r)).forEach((resourceToDecrease) => {
      const selectOption = new SelectOption(message('Decrease ${0} production', (b) => b.string(resourceToDecrease))).andThen(() => {
        const decreasable = player.production.get(resourceToDecrease) - PRODUCTION_MINIMUMS[resourceToDecrease];
        const maxDecreasableAmt = Math.min(player.game.generation + 2, decreasable);

        return new SelectAmount(
          `Select amount of ${resourceToDecrease} production to decrease`,
          'Decrease',
          1,
          maxDecreasableAmt,
          true,
        ).andThen((amount) => {
          const productionToIncrease =
            ALL_RESOURCES.filter((res) => res !== resourceToDecrease)
              .map((res) => new SelectOption(message('Increase ${0} production', (b) => b.string(res))).andThen(() => {
                player.production.add(resourceToDecrease, -amount, {log: true});
                // player.production.adjust()
                player.production.add(res, amount, {log: true});
                return undefined;
              }));

          return new OrOptions(...productionToIncrease);
        });
      });

      choices.options.push(selectOption);
    });

    return choices;
  }

  private productionIsDecreasable(player: IPlayer, resource: Resource): boolean {
    return player.production.get(resource) > PRODUCTION_MINIMUMS[resource];
  }
}
