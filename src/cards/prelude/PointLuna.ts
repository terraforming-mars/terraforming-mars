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

export class PointLuna extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.POINT_LUNA,
      tags: [Tags.SPACE, Tags.EARTH],
      startingMegaCredits: 38,

      metadata: {
        cardNumber: 'R10',
        description: 'You start with 1 titanium production and 38 MC.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.production((pb) => pb.titanium(1)).nbsp.megacredits(38);
          b.corpBox('effect', (ce) => {
            ce.effect('When you play an Earth tag, including this, draw a card.', (eb) => {
              eb.earth().played.startEffect.cards(1);
            });
          });
        }),
      },
    });
  }
  public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
    const tagCount = card.tags.filter((tag) => tag === Tags.EARTH).length;
    if (player.isCorporation(this.name) && card.tags.indexOf(Tags.EARTH) !== -1) {
      player.drawCard(tagCount);
    }
  }
  public play(player: Player) {
    player.addProduction(Resources.TITANIUM);
    player.drawCard();
    return undefined;
  }
}
