import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../../common/cards/Tags';
import {Resources} from '../../common/Resources';
import {Card} from '../Card';
import {CardName} from '../../common/cards/CardName';
import {ITagCount} from '../../common/cards/ITagCount';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class AgricolaInc extends Card implements CorporationCard {
  constructor() {
    super({
      name: CardName.AGRICOLA_INC,
      tags: [Tags.PLANT],
      startingMegaCredits: 40,
      cardType: CardType.CORPORATION,

      victoryPoints: 'special',

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

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 1);
    player.addProduction(Resources.PLANTS, 1);

    return undefined;
  }

  public override getVictoryPoints(player: Player): number {
    const scorableTags : Array<Tags> = [Tags.CITY, Tags.EARTH, Tags.ENERGY, Tags.JOVIAN, Tags.MICROBE, Tags.PLANT, Tags.SCIENCE, Tags.SPACE, Tags.BUILDING, Tags.ANIMAL];
    if (player.game.gameOptions.venusNextExtension) scorableTags.push(Tags.VENUS);

    const playerTags : ITagCount[] = player.getAllTags();
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
