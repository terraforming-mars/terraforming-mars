import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {Resources} from '../../../common/Resources';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';

export class RefugeeCamps extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 10,
      tags: [Tag.EARTH],
      name: CardName.REFUGEE_CAMPS,
      cardType: CardType.ACTIVE,
      resourceType: CardResource.CAMP,
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


  public canAct(player: Player): boolean {
    return player.production.megacredits >= -4;
  }

  public action(player: Player) {
    player.production.add(Resources.MEGACREDITS, -1);
    player.addResourceTo(this, 1);
    return undefined;
  }
}

