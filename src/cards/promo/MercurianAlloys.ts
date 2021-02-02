import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class MercurianAlloys extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MERCURIAN_ALLOYS,
      tags: [Tags.SPACE],
      cost: 3,

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)),
      metadata: {
        cardNumber: 'X07',
        renderData: CardRenderer.builder((b) => {
          b.effect('Your titanium resources are worth 1 MC extra.', (eb) => {
            eb.titanium(1).startEffect.plus(CardRenderItemSize.SMALL).megacredits(1);
          });
        }),
        description: 'Requires 2 Science tags.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.SCIENCE) >= 2;
  }

  public play(player: Player) {
    player.increaseTitaniumValue();
    return undefined;
  }

  public onDiscard(player: Player): void {
    player.decreaseTitaniumValue();
  }
}
