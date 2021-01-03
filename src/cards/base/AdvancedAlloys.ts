import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class AdvancedAlloys extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ADVANCED_ALLOYS,
      tags: [Tags.SCIENCE],
      cost: 9,

      metadata: {
        cardNumber: '071',
        renderData: CardRenderer.builder((b) => {
          b.effectBox((be) => be.titanium(1).startEffect.plus(CardRenderItemSize.SMALL).megacredits(1).description('Effect: Each titanium you have is worth 1 MC extra.')).br;
          b.effectBox((be) => be.steel(1).startEffect.plus(CardRenderItemSize.SMALL).megacredits(1).description('Effect: Each steel you have is worth 1 MC extra.'));
        }),
      },
    });
  }

  public play(player: Player) {
    player.increaseTitaniumValue();
    player.increaseSteelValue();
    return undefined;
  }

  public onDiscard(player: Player): void {
    player.decreaseTitaniumValue();
    player.decreaseSteelValue();
  }
}
