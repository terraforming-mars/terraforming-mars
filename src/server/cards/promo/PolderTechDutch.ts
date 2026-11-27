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
import {Phase} from '../../../common/Phase';
import {AresHazards} from '@/server/ares/AresHazards';
import {OrOptions} from '@/server/inputs/OrOptions';
import {SelectOption} from '@/server/inputs/SelectOption';

const HELP_TEXT = `
**Compatibility with Ares**

The ocean you place may be the one that adds erosion tiles (normally the third ocean on Mars).

An erosion can land on or next to the spaces where you might place your greeneries. If
that leaves no affordable space, you may not be able to place it.

This is one place where the game breaks the rule of "all actions are mandatory".

You choose whether to place the ocean or the greenery first. Placing the greenery
first means it can't be blocked, but it doesn't get the bonus for being next to the new ocean.

**Compatibility with Red City**

PolderTECH overrides Red City's greenery-placement restrictions.
` as const;

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
        helpText: HELP_TEXT,
      },
    });
  }

  public override initialAction(player: IPlayer) {
    const orOptions = new OrOptions(
      new SelectOption('Place the ocean first').andThen(() => {
        this.placeOceanFirst(player);
        return undefined;
      }),
      new SelectOption('Place the greenery first').andThen(() => {
        this.placeGreeneryFirst(player);
        return undefined;
      }),
    );
    // Placing the ocean first can add erosions that leave no greenery space next to it.
    if (AresHazards.nextOceanPlacesErosionTiles(player.game)) {
      orOptions.setWarning('This ocean adds erosion tiles, which may leave no space for the greenery. ' +
        'Placing the greenery first gives up its bonus for being next to the new ocean');
    }
    return orOptions;
  }

  private placeOceanFirst(player: IPlayer) {
    const board = player.game.board;

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
        if (validGreenerySpaces.length === 0) {
          player.game.log('${0} could not place a greenery next to the ocean', (b) => b.player(player));
          return;
        }
        player.defer(
          new SelectSpace('Select space for greenery tile', validGreenerySpaces)
            .andThen((greenerySpace) => {
              player.game.addGreenery(player, greenerySpace);
              return undefined;
            }));
      });
  }

  private placeGreeneryFirst(player: IPlayer) {
    const board = player.game.board;

    const oceanSpaces = board.getAvailableSpacesForOcean(player);
    const greenerySpacesNextToOceanSpaces = board.getAvailableSpacesOnLand(player).filter((space) => {
      return board.getAdjacentSpaces(space).some((adjacentSpace) => oceanSpaces.includes(adjacentSpace));
    });

    player.defer(
      new SelectSpace('Select space for greenery tile', greenerySpacesNextToOceanSpaces)
        .andThen((greenerySpace) => {
          player.game.addGreenery(player, greenerySpace);
          const validOceanSpaces = intersection(board.getAvailableSpacesForOcean(player), board.getAdjacentSpaces(greenerySpace));
          player.game.defer(new PlaceOceanTile(player, {spaces: validOceanSpaces}));
          return undefined;
        }));
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space): void {
    if (cardOwner !== activePlayer) {
      return;
    }
    // During World Government Terraforming the active player places the ocean but
    // it is not "their" placement, so the effect should not trigger.
    if (cardOwner.game.phase === Phase.SOLAR) {
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
