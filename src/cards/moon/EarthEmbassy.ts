import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class EarthEmbassy extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.EARTH_EMBASSY,
      cardType: CardType.ACTIVE,
      tags: [Tags.MOON, Tags.EARTH],
      cost: 16,

      metadata: {
        description: 'This does not count your Earth tags as Moon tags.',
        cardNumber: 'M77',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you perform an action, your Moon tags count as Earth tags, even here.', (eb) => {
            // TODO(kberg): fix this viz. .earth() doesn't work.
            eb.empty().startEffect.moon().nbsp.text(' = ').nbsp.text('earth');
          });
        }),
      },
    });
  };


  public canPlay(): boolean {
    return true;
  }

  // Behavior is baked into `Player.getTagCount`
  public play() {
    return undefined;
  }
}
