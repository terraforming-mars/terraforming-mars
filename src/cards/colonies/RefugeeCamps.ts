import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {Resources} from '../../Resources';
import {IResourceCard} from '../ICard';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class RefugeeCamps extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cost: 10,
      tags: [Tags.EARTH],
      name: CardName.REFUGEE_CAMP,
      cardType: CardType.ACTIVE,
      resourceType: ResourceType.CAMP,

      metadata: {
        cardNumber: 'C33',
        renderData: CardRenderer.builder((b) => {
          b.action('Decrease your M€ production 1 step to add a camp resource to this card.', (eb) => {
            eb.production((pb) => pb.megacredits(1));
            eb.startAction.camps();
          }).br;
          b.vpText('1 VP for each camp resource on this card.');
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.camps(1, 1),
      },
    });
  }

  public resourceCount: number = 0;

  public canAct(player: Player): boolean {
    return player.getProduction(Resources.MEGACREDITS) >= -4;
  }

  public action(player: Player) {
    player.addProduction(Resources.MEGACREDITS, -1);
    player.addResourceTo(this, 1);
    return undefined;
  }

  public play() {
    return undefined;
  }

  public getVictoryPoints(): number {
    return this.resourceCount;
  }
}

