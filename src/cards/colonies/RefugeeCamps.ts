import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Resources} from '../../common/Resources';
import {ResourceType} from '../../common/ResourceType';
import {IResourceCard} from '../ICard';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';

export class RefugeeCamps extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cost: 10,
      tags: [Tags.EARTH],
      name: CardName.REFUGEE_CAMP,
      cardType: CardType.ACTIVE,
      resourceType: ResourceType.CAMP,
      victoryPoints: VictoryPoints.resource(1, 1),

      metadata: {
        cardNumber: 'C33',
        renderData: CardRenderer.builder((b) => {
          b.action('Decrease your M€ production 1 step to add a camp resource to this card.', (eb) => {
            eb.production((pb) => pb.megacredits(1));
            eb.startAction.camps();
          }).br;
          b.vpText('1 VP for each camp resource on this card.');
        }),
      },
    });
  }

  public override resourceCount: number = 0;

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
}

