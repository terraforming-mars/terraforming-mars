import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {MoonSpaces} from '../../moon/MoonSpaces';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonRoadTile} from '../../moon/PlaceMoonRoadTile';
import {Units} from '../../Units';
import {SpaceType} from '../../SpaceType';

export class MareSerenitatisMine implements IProjectCard {
  public cost = 21;
  public tags = [Tags.MOON, Tags.BUILDING];
  public cardType = CardType.AUTOMATED;
  public name = CardName.MARE_SERENITATIS_MINE;
  public reserveUnits = Units.of({titanium: 2, steel: 1});

  public play(player: Player) {
    Units.deductUnits(this.reserveUnits, player);
    player.addProduction(Resources.STEEL, 1);
    player.addProduction(Resources.TITANIUM, 1);
    MoonExpansion.addMineTile(player, MoonSpaces.MARE_SERENITATIS, this.name);
    MoonExpansion.raiseMiningRate(player);
    const moon = MoonExpansion.moonData(player.game).moon;
    const spaces = moon.getAdjacentSpaces(moon.getSpace(MoonSpaces.MARE_SERENITATIS));
    const availableRoadSpaces = spaces.filter((space) => {
      return space.player === undefined && space.spaceType === SpaceType.LAND;
    });
    player.game.defer(new PlaceMoonRoadTile(player, 'Select a space next to Mare Serintatis to play a road', availableRoadSpaces));
    return undefined;
  }

  public readonly metadata: CardMetadata = {
    description: 'Spend 2 titanium and 1 steel. Increase your steel production 1 step and your titanium production 1 step. ' +
    'Place a mine ON THE RESERVED AREA and adjacent to it road tile. Raise Mining Rate 1 step and Logistic Rate 1 step.',
    cardNumber: 'M04',
    renderData: CardRenderer.builder((b) => {
      b.minus().titanium(2).minus().steel(1).br;
      b.production((pb) => pb.steel(1).titanium(1)).br;
      b.moonMine().asterix().nbsp.moonRoad().asterix();
    }),
  };
}
