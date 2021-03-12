import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
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
          b.effect('Your steel resources are worth 1 MC extra.', (eb) => {
            eb.steel(1).startEffect.plus(CardRenderItemSize.SMALL).megacredits(1);
          });
        }),
      },
    });
  };

  public play(player: Player) {
    player.increaseSteelValue();
    return undefined;
  }

  public onDiscard(player: Player): void {
    player.decreaseSteelValue();
  }
}
