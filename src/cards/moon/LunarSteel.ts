import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../common/cards/render/Size';
import {Card} from '../Card';

export class LunarSteel extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_STEEL,
      cardType: CardType.ACTIVE,
      tags: [Tags.MOON],
      cost: 5,

      metadata: {
        cardNumber: 'M87',
        renderData: CardRenderer.builder((b) => {
          b.effect('Your steel resources are worth 1 M€ extra.', (eb) => {
            eb.steel(1).startEffect.plus(Size.SMALL).megacredits(1);
          });
        }),
      },
    });
  }

  public play(player: Player) {
    player.increaseSteelValue();
    return undefined;
  }

  public onDiscard(player: Player): void {
    player.decreaseSteelValue();
  }
}
