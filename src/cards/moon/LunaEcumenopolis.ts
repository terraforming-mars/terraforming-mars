import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {AltSecondaryTag} from '../render/CardRenderItem';
import {MoonCard} from './MoonCard';
import {TileType} from '../../TileType';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {DeferredAction} from '../../deferredActions/DeferredAction';

export class LunaEcumenopolis extends MoonCard {
  constructor() {
    super({
      name: CardName.LUNA_ECUMENOPOLIS,
      cardType: CardType.AUTOMATED,
      tags: [Tags.CITY, Tags.CITY, Tags.MOON],
      cost: 35,
      reserveUnits: Units.of({titanium: 2}),

      metadata: {
        description: 'Spend 2 Titanium. ' +
        'Place 2 colony tiles adjacent to at least 2 other colony tiles and raise Colony rate 2 steps. ' +
        'Increase your TR 1 step for each 2 steps of the colony rate.',
        cardNumber: 'M84',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(2).nbsp;
          b.text('2').moonColony({secondaryTag: AltSecondaryTag.MOON_COLONY_RATE}).asterix().br;
          b.tr(1).slash().moonColonyRate().moonColonyRate();
        }),
      },
    }, {
      tilesBuilt: [TileType.MOON_COLONY],
    });
  };

  public play(player: Player) {
    // These all have the same priority: Default.
    player.game.defer(new CustomPlaceMoonTile(player));
    player.game.defer(new CustomPlaceMoonTile(player));
    player.game.defer(new DeferredAction(player, () => {
      const colonyRate = MoonExpansion.moonData(player.game).colonyRate;
      player.increaseTerraformRatingSteps(Math.floor(colonyRate / 2));
      return undefined;
    }));
    return undefined;
  }
}

class CustomPlaceMoonTile extends PlaceMoonColonyTile {
  protected getSpaces() {
    const moonData = MoonExpansion.moonData(this.player.game);
    const spaces = moonData.moon.getAvailableSpacesOnLand(this.player);
    const filtered = spaces.filter((space) => {
      const adjacentSpaces = moonData.moon.getAdjacentSpaces(space).filter((adjacentSpace) => {
        return adjacentSpace.tile?.tileType === TileType.MOON_COLONY;
      });
      return adjacentSpaces.length >= 2;
    });
    return filtered;
  }
}
