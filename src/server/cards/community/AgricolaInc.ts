import {ICorporationCard} from '../corporation/ICorporationCard';
import {Player} from '../../Player';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {ITagCount} from '../../../common/cards/ITagCount';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class AgricolaInc extends Card implements ICorporationCard {
  constructor() {
    super({
      name: CardName.AGRICOLA_INC,
      tags: [Tag.PLANT],
      startingMegaCredits: 40,
      cardType: CardType.CORPORATION,

      victoryPoints: 'special',
      behavior: {
        production: {megacredits: 1, plants: 1},
      },

      metadata: {
        cardNumber: 'R36',
        description: 'You start with 1 plant production, 1 M€ production and 40 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.production((pb) => pb.megacredits(1).plants(1)).nbsp.megacredits(40);
          b.corpBox('effect', (ce) => {
            ce.text('Effect: At game end, score -2 / 0 / 1 / 2 VP PER TAG TYPE for 0 / 1-2 / 3-4 / 5+ tags.', Size.SMALL, true);
          });
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.questionmark(),
      },
    });
  }

  public override getVictoryPoints(player: Player): number {
    const scorableTags : Array<Tag> = [Tag.CITY, Tag.EARTH, Tag.ENERGY, Tag.JOVIAN, Tag.MICROBE, Tag.PLANT, Tag.SCIENCE, Tag.SPACE, Tag.BUILDING, Tag.ANIMAL];
    if (player.game.gameOptions.venusNextExtension) scorableTags.push(Tag.VENUS);

    const playerTags : ITagCount[] = player.tags.getAllTags();
    let points = 0;

    scorableTags.forEach((tag) => {
      const tagData = playerTags.find((data) => data.tag === tag);

      if (tagData === undefined) {
        points -= 2;
      } else if (tagData.count === 3 || tagData.count === 4) {
        points += 1;
      } else if (tagData.count > 4) {
        points += 2;
      }
    });

    return points;
  }
}
