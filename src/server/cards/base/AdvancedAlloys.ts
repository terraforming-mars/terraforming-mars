import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class AdvancedAlloys extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ADVANCED_ALLOYS,
      tags: [Tag.SCIENCE],
      cost: 9,

      metadata: {
        cardNumber: '071',
        renderData: CardRenderer.builder((b) => {
          b.effect('Each titanium you have is worth 1 M€ extra.', (be) => {
            be.titanium(1).startEffect.plus(Size.SMALL).megacredits(1);
          }).br;
          b.effect('Each steel you have is worth 1 M€ extra.', (be) => {
            be.steel(1).startEffect.plus(Size.SMALL).megacredits(1);
          });
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.increaseTitaniumValue();
    player.increaseSteelValue();
    return undefined;
  }

  public onDiscard(player: Player): void {
    player.decreaseTitaniumValue();
    player.decreaseSteelValue();
  }
}
