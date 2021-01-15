import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CorporationCard} from './../corporation/CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';

export class CheungShingMARS extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.CHEUNG_SHING_MARS,
      tags: [Tags.BUILDING],
      startingMegaCredits: 44,

      metadata: {
        cardNumber: 'R16',
        description: 'You start with 3 MC production and 44 MC.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.production((pb) => pb.megacredits(3)).nbsp.megacredits(44);
          b.corpBox('effect', (ce) => {
            ce.effect('When you play a building tag, you pay 2 MC less for it.', (eb) => {
              eb.building().played.startEffect.megacredits(-2);
            });
          });
        }),
      },
    });
  }

  public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
    return card.tags.filter((tag) => tag === Tags.BUILDING).length * 2;
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 3);
    return undefined;
  }
}
