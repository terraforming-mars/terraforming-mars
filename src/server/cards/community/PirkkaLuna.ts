import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CorporationCard} from '../corporation/CorporationCard';
import {ICard} from '../ICard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class PirkkaLuna extends CorporationCard {
    private generationMap: Record<number, boolean> = {};
  constructor() {
    super({
      name: CardName.PIRKKA_LUNA,
      tags: [Tag.SCIENCE, Tag.EARTH],
      startingMegaCredits: 44,

      behavior: {
        drawCard: {count: 3, tag: Tag.SCIENCE},
      },

      metadata: {
        cardNumber: 'MI7',
        description: 'Start with 44M€. ',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.corpBox('effect', (ce) => {
            ce.effect('When you play an Earth tag, draw card, once per gen, excluding this', (eb) => {
              eb.tag(Tag.EARTH).startEffect.cards(1).slash().text("Generation", undefined, undefined, true);
            });
          });
        }),
      },
    });
  }
  public onCorpCardPlayed(player: IPlayer, card: ICorporationCard) {
    
    if (card === this) {
        return undefined;
    }
    return this.onCardPlayed(player, card);
  }

  public onCardPlayed(player: IPlayer, card: ICard) {
    console.log("This pirkka luna gen map ", this.generationMap, ", current gen ", player.game.generation)
    if (player.isCorporation(this.name) && !this.generationMap[player.game.generation]) {
      const tagCount = player.tags.cardTagCount(card, Tag.EARTH);
      if (tagCount > 0) {
        this.generationMap[player.game.generation] = true;
        player.drawCard(1);
      }
    }
  }
}
