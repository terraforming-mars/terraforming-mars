import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Livestock extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.LIVESTOCK,
      tags: [Tags.ANIMAL],
      cost: 13,

      resourceType: ResourceType.ANIMAL,
      victoryPoints: VictoryPoints.resource(1, 1),
      requirements: CardRequirements.builder((b) => b.oxygen(9)),

      metadata: {
        cardNumber: '184',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Animal to this card.', (eb) => {
            eb.empty().startAction.animals(1);
          }).br;
          b.production((pb) => {
            pb.minus().plants(1).nbsp.plus().megacredits(2);
          }).br;
          b.vpText('1 VP for each Animal on this card.');
        }),
        description: {
          text: 'Requires 9% oxygen. Decrease your Plant production 1 step and increase your M€ production 2 steps',
          align: 'left',
        },
      },
    });
  }

    public resourceCount = 0;
    public canPlay(player: Player): boolean {
      return player.getProduction(Resources.PLANTS) >= 1;
    }
    public play(player: Player) {
      player.addProduction(Resources.PLANTS, -1);
      player.addProduction(Resources.MEGACREDITS, 2);
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }
    public action(player: Player) {
      player.addResourceTo(this);
      return undefined;
    }
}

