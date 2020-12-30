import {Card} from '../Card';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CorporationCard} from './CorporationCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class PhoboLog extends Card implements CorporationCard {
  constructor() {
    super({
      name: CardName.PHOBOLOG,
      tags: [Tags.SPACE],
      startingMegaCredits: 23,
      cardType: CardType.CORPORATION,
      metadata: {
        cardNumber: 'R09',
        description: 'You start with 10 titanium and 23 MC.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(23).nbsp.titanium(10).digit;
          b.corpBox('effect', (ce) => {
            ce.effectBox((eb) => {
              eb.titanium(1).startEffect.plus(CardRenderItemSize.SMALL).megacredits(1);
              eb.description('Effect: Your titanium resources are each worth 1 MC extra.');
            });
          });
        }),
      },
    });
  }
  public play(player: Player, _game: Game) {
    player.titanium = 10;
    player.increaseTitaniumValue();
    return undefined;
  }
}
