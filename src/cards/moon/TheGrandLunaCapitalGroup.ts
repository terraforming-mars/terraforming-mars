import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../TileType';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../Resources';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class TheGrandLunaCapitalGroup implements CorporationCard {
  public startingMegaCredits = 32;
  public tags = [Tags.CITY, Tags.MOON];
  public cardType = CardType.CORPORATION;
  public name = CardName.THE_GRAND_LUNA_CAPITAL_GROUP;
  public initialActionText = 'Place a colony tile';

  public readonly metadata: CardMetadata = {
    description: {
      text: 'You start with 32 MC and 1 titanium. As your first action, place a colony tile on the Moon and raise the Colony Rate 1 step.',
      align: 'left',
    },
    cardNumber: 'MC7',
    renderData: CardRenderer.builder((b) => {
      b.megacredits(32).titanium(1).moonColony().br;
      b.effect('When you place a colony tile, gain 2 MC for each adjacent colony tile.', (eb) => {
        eb.tile(TileType.MOON_COLONY, false).tile(TileType.MOON_COLONY, false).asterix()
          .startEffect
          .megacredits(2).slash().tile(TileType.MOON_COLONY, false);
      }).br,
      b.vpText('1 VP for each colony tile adjacent to your colony tiles.').br;
    }),
    victoryPoints: CardRenderDynamicVictoryPoints.colonyTile(1),
  };

  public play(player: Player) {
    player.titanium++;
    return undefined;
  }

  public initialAction(player: Player) {
    player.game.defer(new PlaceMoonColonyTile(player));
    return undefined;
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (cardOwner.id !== activePlayer.id) {
      return;
    }
    if (space.tile?.tileType !== TileType.MOON_COLONY) {
      return;
    }
    const adjacentSpaces = MoonExpansion.moonData(cardOwner.game).moon.getAdjacentSpaces(space);
    const filtered = adjacentSpaces.filter((space) => space.tile?.tileType === TileType.MOON_COLONY);
    cardOwner.setResource(Resources.MEGACREDITS, filtered.length * 2, cardOwner.game);
  }

  public getVictoryPoints(player: Player) {
    const moon = MoonExpansion.moonData(player.game).moon;
    const colonyTiles = MoonExpansion.tiles(player.game, TileType.MOON_COLONY, true);
    const tilesAdjacentToPlayer = colonyTiles.filter((tile) =>
      moon.getAdjacentSpaces(tile).some((neighbor) => neighbor.player?.id === player.id));

    return tilesAdjacentToPlayer.length;
  }
}
