import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {ITagCount} from '../../ITagCount';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class AgricolaInc implements CorporationCard {
    public name = CardName.AGRICOLA_INC;
    public tags = [Tags.PLANT];
    public startingMegaCredits: number = 40;
    public cardType = CardType.CORPORATION;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 1);
      player.addProduction(Resources.PLANTS, 1);

      return undefined;
    }

    public getVictoryPoints(player: Player): number {
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
    public metadata: CardMetadata = {
      cardNumber: 'R36',
      description: 'You start with 1 plant production, 1 MC production and 40 MC.',
      renderData: CardRenderer.builder((b) => {
        b.br.br;
        b.production((pb) => pb.megacredits(1).plants(1)).nbsp.megacredits(40);
        b.corpBox('effect', (ce) => {
          ce.text('Effect: At game end, score -2 / 0 / 1 / 2 VP PER TAG TYPE for 0 / 1-2 / 3-4 / 5+ tags.', CardRenderItemSize.SMALL, true);
        });
      }),
      victoryPoints: CardRenderDynamicVictoryPoints.questionmark(),
    }
}
