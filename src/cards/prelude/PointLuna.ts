import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../common/Resources';
import {Card} from '../Card';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class PointLuna extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.POINT_LUNA,
      tags: [Tags.SPACE, Tags.EARTH],
      startingMegaCredits: 38,

      metadata: {
        cardNumber: 'R10',
        description: 'You start with 1 titanium production and 38 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.production((pb) => pb.titanium(1)).nbsp.megacredits(38);
          b.corpBox('effect', (ce) => {
            ce.effect('When you play an Earth tag, including this, draw a card.', (eb) => {
              eb.earth(1, {played}).startEffect.cards(1);
            });
          });
        }),
      },
    });
  }
  public onCorpCardPlayed(player: Player, card: ICorporationCard) {
    return this.onCardPlayed(player, card);
  }

  public onCardPlayed(player: Player, card: IProjectCard | ICorporationCard) {
    const tagCount = card.tags.filter((tag) => tag === Tags.EARTH).length;
    if (player.isCorporation(this.name) && card.tags.includes(Tags.EARTH)) {
      player.drawCard(tagCount);
    }
    return undefined;
  }
  public play(player: Player) {
    player.addProduction(Resources.TITANIUM, 1);
    player.drawCard();
    return undefined;
  }
}
