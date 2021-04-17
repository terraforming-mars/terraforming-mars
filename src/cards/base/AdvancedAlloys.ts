import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

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
          b.effect('Each titanium you have is worth 1 MC extra.', (be) => {
            be.titanium(1).startEffect.plus('small').megacredits(1);
          }).br;
          b.effect('Each steel you have is worth 1 MC extra.', (be) => {
            be.steel(1).startEffect.plus('small').megacredits(1);
          });
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
