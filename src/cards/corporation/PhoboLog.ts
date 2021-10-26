import {Card} from '../Card';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CorporationCard} from './CorporationCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {digit} from '../Options';

export class PhoboLog extends Card implements CorporationCard {
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
