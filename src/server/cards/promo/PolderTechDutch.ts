import {CorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Space} from '../../boards/Space';
import {TileType} from '../../../common/TileType';
import {Resource} from '../../../common/Resource';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {intersection} from '../../../common/utils/utils';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Size} from '../../../common/cards/render/Size';
import {Tag} from '../../../common/cards/Tag';

// TODO(kberg): PolderTech is not yet compatible with Ares or Red City.
export class PolderTechDutch extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.POLDERTECH_DUTCH,
      tags: [Tag.EARTH],
      startingMegaCredits: 35,

      initialActionText: 'Place an ocean tile and a greenery tile next to each other',

      metadata: {
        cardNumber: 'X-3',
        description: 'You start with 35 M€. As your first action, place an ocean tile and a greenery tile next to each other IGNORING GREENERY PLACEMENT RESTRICTIONS. Raise oxygen 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(35).oceans(1, {size: Size.SMALL}).greenery({size: Size.SMALL}).asterix().br;
          b.effect('When you place an ocean tile, gain 1 energy.', (eb) => eb.oceans(1, {size: Size.SMALL}).startEffect.energy(1)).br;
          b.effect('When you place a greenery, gain 1 plant.', (eb) => eb.greenery({size: Size.SMALL}).startEffect.plants(1)).br;
        }),
      },
    });
  }

  public override initialAction(player: IPlayer) {
    const board = player.game.board;

    // Find valid ocean space. They have to be next to a place to put the greenery.
    // Greenery spaces can be any space because this corp ignores greenery placement restrictions.
    const oceanSpaces = board.getAvailableSpacesForOcean(player);
    const greenerySpaces = board.getAvailableSpacesOnLand(player);
    const oceanSpacesNextToGreenerySpaces = oceanSpaces.filter((space) => {
      return board.getAdjacentSpaces(space).some((adjacentSpace) => greenerySpaces.includes(adjacentSpace));
    });

    player.game.defer(new PlaceOceanTile(player, {spaces: oceanSpacesNextToGreenerySpaces}))
      .andThen((space) => {
        // Should not happen.
        if (space === undefined) {
          return;
        }
        const greenerySpaces = board.getAvailableSpacesOnLand(player);
        const adjacentSpaces = board.getAdjacentSpaces(space);
        const validGreenerySpaces = intersection(greenerySpaces, adjacentSpaces);
        player.defer(
          new SelectSpace('Select space for greenery tile', validGreenerySpaces)
            .andThen((greenerySpace) => {
              player.game.addGreenery(player, greenerySpace);
              return undefined;
            }));
      });

    return undefined;
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space): void {
    if (cardOwner !== activePlayer) {
      return;
    }
    if (space.tile?.tileType === TileType.OCEAN) {
      cardOwner.stock.add(Resource.ENERGY, 1, {log: true, from: {card: this}});
    }
    if (space.tile?.tileType === TileType.GREENERY) {
      cardOwner.stock.add(Resource.PLANTS, 1, {log: true, from: {card: this}});
    }
  }
}
