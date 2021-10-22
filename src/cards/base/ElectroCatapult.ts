import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {max} from '../Options';

export class ElectroCatapult extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ELECTRO_CATAPULT,
      tags: [Tags.BUILDING],
      cost: 17,
      productionBox: Units.of({energy: -1}),
      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.oxygen(8, {max})),
      metadata: {
        cardNumber: '069',
        description: {
          text: 'Oxygen must be 8% or less. Decrease your energy production 1 step.',
          align: 'left',
        },
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 plant or 1 steel to gain 7 M€.', (eb) => {
            eb.plants(1).slash().steel(1).startAction.megacredits(7);
          }).br;
          b.production((pb) => pb.minus().energy(1));
        }),
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1;
  }
  public canAct(player: Player): boolean {
    return player.plants > 0 || player.steel > 0;
  }
  public action(player: Player) {
    if (player.plants > 0 && player.steel > 0) {
      return new OrOptions(
        new SelectOption('Spend 1 plant to gain 7 M€', 'Spend plant', () => {
          player.plants--;
          player.megaCredits += 7;
          this.log(player, Resources.PLANTS);
          return undefined;
        }),
        new SelectOption('Spend 1 steel to gain 7 M€', 'Spend steel', () => {
          player.steel--;
          player.megaCredits += 7;
          this.log(player, Resources.STEEL);
          return undefined;
        }),
      );
    } else if (player.plants > 0) {
      player.plants--;
      this.log(player, Resources.PLANTS);
      player.megaCredits += 7;
    } else if (player.steel > 0) {
      player.steel--;
      this.log(player, Resources.STEEL);
      player.megaCredits += 7;
    }
    return undefined;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    return undefined;
  }

  private log(player: Player, resource: Resources) {
    player.game.log('${0} spent 1 ${1} to gain 7 M€', (b) => b.player(player).string(resource));
  }
}
