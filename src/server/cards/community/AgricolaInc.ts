import {CorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {questionmark} from '../render/DynamicVictoryPoints';
import {inplaceRemove} from '../../../common/utils/utils';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class AgricolaInc extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.AGRICOLA_INC,
      tags: [Tag.PLANT],
      startingMegaCredits: 40,

      victoryPoints: 'special',
      behavior: {
        production: {megacredits: 1, plants: 1, heat: 1},
      },

      metadata: {
        cardNumber: 'R36',
        description: 'You start with 1 plant production, 1 M€ production, 1 heat production and 40 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.production((pb) => pb.megacredits(1).plants(1).heat(1)).nbsp.megacredits(40);
          b.corpBox('effect', (ce) => {
            ce.text('Effect: At game end, score -2 / 0 / 1 / 2 VP PER TAG TYPE for 0 / 1-2 / 3-4 / 5+ tags.', Size.SMALL, true);
          });
        }),
        victoryPoints: questionmark(),
      },
    });
  }

  public override getVictoryPoints(player: IPlayer): number {
    const scorableTags = [...player.game.tags];
    inplaceRemove(scorableTags, Tag.WILD);
    inplaceRemove(scorableTags, Tag.EVENT);
    inplaceRemove(scorableTags, Tag.CLONE);

    const counts = player.tags.countAllTags();
    let points = 0;

    scorableTags.forEach((tag) => {
      const count = counts[tag];

      if (count === 0) {
        points -= 2;
      } else if (count === 3 || count === 4) {
        points += 1;
      } else if (count > 4) {
        points += 2;
      }
    });

    return points;
  }
}
