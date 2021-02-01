import {IProjectCard} from '../IProjectCard';
import {IActionCard, IResourceCard} from '../ICard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {ResourceType} from '../../ResourceType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {GlobalParameter} from '../../GlobalParameter';

export class Penguins extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.PENGUINS,
      tags: [Tags.ANIMAL],
      cost: 7,
      resourceType: ResourceType.ANIMAL,

      requirements: CardRequirements.builder((b) => b.oceans(8)),
      metadata: {
        cardNumber: '212',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Animal to this card.', (eb) => {
            eb.empty().startAction.animals(1);
          }).br;
          b.vpText('1 VP for each animal on this card.');
        }),
        description: 'Requires 8 oceans.',
        victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 1),
      },
    });
  }
    public resourceCount = 0;

    public canPlay(player: Player): boolean {
      return player.game.checkMinRequirements(player, GlobalParameter.OCEANS, 8);
    }

    public play() {
      return undefined;
    }

    public canAct(): boolean {
      return true;
    }

    public action(player: Player) {
      player.addResourceTo(this);
      return undefined;
    }

    public getVictoryPoints(): number {
      return this.resourceCount;
    }
}
