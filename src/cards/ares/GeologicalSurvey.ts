import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {TileType} from '../../TileType';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';


export class GeologicalSurvey implements IProjectCard {
  public cost = 8;
  public tags = [Tags.SCIENCE];
  public cardType = CardType.ACTIVE;
  public name = CardName.GEOLOGICAL_SURVEY;

  private countGreeneryTiles(game: Game): number {
    return game.board.spaces.filter(
      (space) => space.tile !== undefined && space.tile.tileType === TileType.GREENERY).length;
  }

  public canPlay(_player: Player, game: Game): boolean {
    return this.countGreeneryTiles(game) <= 5;
  }

  public play(_player: Player, _game: Game) {
    return undefined;
  }

  public metadata: CardMetadata = {
    cardNumber: 'A09',
    requirements: CardRequirements.builder((b) => b.greeneries(5).max()),
    renderData: CardRenderer.builder((b) => {
      b.effectBox((eb) => {
        eb.emptyTile().startEffect;
        eb.plus().steel(1).titanium(1).heat(1);
        eb.description('Effect: When placing a tile grants you any steel, titanium, or heat, you gain one additional of each of those resources that you gain.');
      });
    }),
    description: 'Requires 5 or fewer greeneries on Mars.',
  };
}
