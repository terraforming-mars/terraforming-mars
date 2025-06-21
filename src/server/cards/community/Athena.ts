import {CorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {PlaceHazardTile} from '../../deferredActions/PlaceHazardTile';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {TileType} from '../../../common/TileType';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class Athena extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.ATHENA,
      tags: [Tag.EARTH],
      initialActionText: 'Place 2 hazard tiles adjacent to no other tiles.',
      startingMegaCredits: 62,

      metadata: {
        cardNumber: 'R52',
        description: 'You start with 62 M€. As your first action, place 2 hazard tiles adjacent to no other tiles.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(62).hazardTile(1, {size: Size.LARGE}).hazardTile(1, {size: Size.LARGE});
          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.SMALL);
            ce.effect('You do not lose production when placing adjacent to hazard tiles.', (eb) => {
              eb.startEffect.hazardTile(1, {size: Size.LARGE}).nbsp.asterix();
            });
          });
        }),
      },
    });
  }

  public initialAction(player: IPlayer) {
    const game = player.game;
    const title = 'Select space next to no other tile for hazard';

    if (game.gameOptions.aresExtension) {
      game.defer(new PlaceHazardTile(
        player, TileType.EROSION_MILD, {title, spaces: this.getAvailableSpaces(player)}))
        .andThen(() => {
          game.defer(new PlaceHazardTile(
            player, TileType.EROSION_MILD, {title, spaces: this.getAvailableSpaces(player)}));
        });
    }

    return undefined;
  }

  private getAvailableSpaces(player: IPlayer) {
    const board = player.game.board;
    return board.getAvailableSpacesOnLand(player)
      .filter(((space) => space.tile === undefined))
      .filter((space) => {
        const adjacentSpaces = board.getAdjacentSpaces(space);
        return adjacentSpaces.filter((space) => space.tile !== undefined).length === 0;
      });
  }
}
