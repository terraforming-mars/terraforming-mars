import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {TileType} from '../../TileType';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class EcologicalSurvey implements IProjectCard {
  public cost = 9;
  public tags = [Tags.SCIENCE];
  public cardType = CardType.ACTIVE;
  public name = CardName.ECOLOGICAL_SURVEY;

  private countGreeneryTiles(game: Game): number {
    return game.board.spaces.filter(
      (space) => space.tile?.tileType === TileType.GREENERY).length;
  }

  public canPlay(_player: Player, game: Game): boolean {
    return this.countGreeneryTiles(game) >= 3;
  }

  public play(_player: Player, _game: Game) {
    return undefined;
  }

  public metadata: CardMetadata = {
    description: 'Requires 3 greeneries on Mars.',
    cardNumber: 'A07',
    requirements: CardRequirements.builder((b) => b.forests(3)),
    renderData: CardRenderer.builder((b) => {
      b.effectBox((eb) => {
        eb.tile(TileType.EMPTY_TILE, false, true).startEffect;
        eb.plus().plants(1).animals(1).microbes(1);
        eb.description('Effect: When placing a tile grants you any plants, animals or microbes, you gain one additional of each of those resources that you gain.');
      });
    }),
  };
}
