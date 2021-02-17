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
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.EARTH],
      cost: 16,

      metadata: {
        description: '',
        cardNumber: 'M77',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you perform an action, you may count your Moon tags as Earth tags, but not vice versa.', (eb) => {
            eb.startEffect.moon(1).colon().earth(1);
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
