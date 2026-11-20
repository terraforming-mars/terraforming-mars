import {TileType} from '@/common/TileType';
import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotTilePlacer} from '@/server/automa/MarsBotTilePlacer';
import {inplaceShuffle} from '@/server/utils/shuffle';

/**
 * The special tile each project card MarsBot can play shows.
 *
 * Capital and New Holland are left out: their tiles are cities, and a city can't go next to the
 * player's city.
 */
const SPECIAL_TILES: ReadonlyMap<CardName, TileType> = new Map([
  [CardName.COMMERCIAL_DISTRICT, TileType.COMMERCIAL_DISTRICT],
  [CardName.ECOLOGICAL_ZONE, TileType.ECOLOGICAL_ZONE],
  [CardName.INDUSTRIAL_CENTER, TileType.INDUSTRIAL_CENTER],
  [CardName.LAVA_FLOWS, TileType.LAVA_FLOWS],
  [CardName.MINING_AREA, TileType.MINING_AREA],
  [CardName.MINING_RIGHTS, TileType.MINING_RIGHTS],
  [CardName.MOHOLE_AREA, TileType.MOHOLE_AREA],
  [CardName.NATURAL_PRESERVE, TileType.NATURAL_PRESERVE],
  [CardName.NUCLEAR_ZONE, TileType.NUCLEAR_ZONE],
  [CardName.RESTRICTED_AREA, TileType.RESTRICTED_AREA],
  [CardName.DEIMOS_DOWN_PROMO, TileType.DEIMOS_DOWN],
  [CardName.GREAT_DAM_PROMO, TileType.GREAT_DAM],
  [CardName.MAGNETIC_FIELD_GENERATORS_PROMO, TileType.MAGNETIC_FIELD_GENERATORS],
]);

export class BuildBuildBuildMarsBot extends MarsBotBonusCard {
  constructor() {
    super({id: BonusCardId.B27_BUILD_BUILD_BUILD, name: CardName.AUTOMA_BUILD_BUILD_BUILD});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    // a. A city next to the player's greenery, then lose 5 M€; b. the special tile of a card MarsBot
    // played next to the player's city, then lose that card and 3 M€; c. gain 3 M€ and shuffle this
    // card back into the bonus deck
    const tilePlacer = new MarsBotTilePlacer(marsBot);
    const citySpace = tilePlacer.findCitySpaceNextToHumanGreenery();
    if (citySpace !== undefined) {
      marsBot.game.addCity(marsBot.player, citySpace);
      marsBot.gainMc(tilePlacer.getTotalPlacementMC(citySpace));
      const lost = marsBot.loseMc(5);
      marsBot.game.log('MarsBot (${0}): places a city next to a greenery of ${1}, loses ${2}:r:mc:',
        (b) => b.cardName(this.name).player(marsBot.humanPlayer).number(lost));
      return false;
    }

    const played = marsBot.playedProjectCards.find((c) => SPECIAL_TILES.has(c.name));
    const tileType = played === undefined ? undefined : SPECIAL_TILES.get(played.name);
    const specialSpace = tileType === undefined ? undefined : tilePlacer.findSpecialTileSpaceNextToHumanCity();
    if (played !== undefined && tileType !== undefined && specialSpace !== undefined) {
      marsBot.game.addTile(marsBot.player, specialSpace, {tileType, card: played.name});
      marsBot.gainMc(tilePlacer.getTotalPlacementMC(specialSpace));
      marsBot.removePlayedProjectCard(played);
      const lost = marsBot.loseMc(3);
      marsBot.game.log('MarsBot (${0}): places the tile of ${1} next to a city of ${2}, removes the card and loses ${3}:r:mc:',
        (b) => b.cardName(this.name).card(played).player(marsBot.humanPlayer).number(lost));
      return false;
    }

    marsBot.gainMc(3);
    marsBot.bonusDeck.drawPile.push(this);
    inplaceShuffle(marsBot.bonusDeck.drawPile, marsBot.game.rng);
    marsBot.game.log('MarsBot (${0}): +3:r:mc:, card shuffled back into the bonus deck', (b) => b.cardName(this.name));
    return true;
  }
}
