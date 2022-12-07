import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../../common/Resources';
import {played} from '../Options';
import {Size} from '../../../common/cards/render/Size';

export class Floraflame extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.FLORAFLAME,
      tags: [Tag.BUILDING, Tag.PLANT],
      startingMegaCredits: 44, // +1 for the initial change in TR.

      metadata: {
        cardNumber: 'B01',
        description: 'You start with 44 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(44);
          b.corpBox('effect', (ce) => {
            ce.vSpace();
            ce.effect('When you play a building tag, including this, gain 2 energy.', (eb) => {
              eb.building(1, {played}).startEffect.energy(2);
            });
            ce.vSpace(Size.SMALL);
            ce.effect('When you play a plant tag, including this, gain 1 plant.', (eb) => {
              eb.plants(1, {played}).startEffect.plants(1);
            });
          });
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    // Typically  onCardPlayed isn't necessary, but onCorpCardPlayed isn't called for your own corp card.
    this.onCardPlayed(player, this);
    return undefined;
  }

  public onCorpCardPlayed(player: Player, card: ICorporationCard) {
    this.onCardPlayed(player, card);
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard | ICorporationCard) {
    if (player.isCorporation(this.name)) {
      const tagCount = player.tags.cardTagCount(card, Tag.BUILDING);
      if (tagCount > 0) {
        player.addResource(Resources.ENERGY, 2, {log: true});
      }
    }

    if (player.isCorporation(this.name)) {
      const tagCount = player.tags.cardTagCount(card, Tag.PLANT);
      if (tagCount > 0) {
        player.addResource(Resources.PLANTS, 1, {log: true});
      }
    }

    return undefined;
  }

}
