import {Card} from '../Card';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {ICorporationCard} from './ICorporationCard';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../common/cards/render/Size';
import {digit} from '../Options';

export class PhoboLog extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.PHOBOLOG,
      tags: [Tags.SPACE],
      startingMegaCredits: 23,

      metadata: {
        cardNumber: 'R09',
        description: 'You start with 10 titanium and 23 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(23).nbsp.titanium(10, {digit});
          b.corpBox('effect', (ce) => {
            ce.effect('Your titanium resources are each worth 1 M€ extra.', (eb) => {
              eb.titanium(1).startEffect.plus(Size.SMALL).megacredits(1);
            });
          });
        }),
      },
    });
  }
  public play(player: Player) {
    player.titanium = 10;
    player.increaseTitaniumValue();
    return undefined;
  }
}
