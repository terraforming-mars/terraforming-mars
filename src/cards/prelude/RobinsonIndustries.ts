import {IActionCard} from '../ICard';
import {Player} from '../../Player';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resources} from '../../common/Resources';
import {Card} from '../Card';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';

export class RobinsonIndustries extends Card implements IActionCard, ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.ROBINSON_INDUSTRIES,
      startingMegaCredits: 47,

      metadata: {
        cardNumber: 'R27',
        description: 'You start with 47 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(47);
          b.corpBox('action', (ce) => {
            ce.action('Spend 4 M€ to increase (one of) your LOWEST production 1 step.', (eb) => {
              eb.megacredits(4).startAction.production((pb) => pb.wild(1).asterix());
            });
          });
        }),
      },
    });
  }
  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    return player.canAfford(4);
  }

  public action(player: Player) {
    let minimum = player.getProduction(Resources.MEGACREDITS);
    let lowest: Array<SelectOption> = [];

    [Resources.MEGACREDITS, Resources.STEEL, Resources.TITANIUM, Resources.PLANTS, Resources.ENERGY, Resources.HEAT].forEach((resource) => {
      const option = new SelectOption('Increase ' + resource + ' production 1 step', 'Select', () => {
        player.deductResource(Resources.MEGACREDITS, 4);
        player.addProduction(resource, 1, {log: true});
        return undefined;
      });

      if (player.getProduction(resource) < minimum) {
        lowest = [];
        minimum = player.getProduction(resource);
      }
      if (player.getProduction(resource) === minimum) lowest.push(option);
    });

    const result = new OrOptions();
    result.options = lowest;
    return result;
  }
}
