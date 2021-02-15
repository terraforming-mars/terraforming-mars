import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../TileType';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';
import {PlaceSpecialMoonTile} from '../../moon/PlaceSpecialMoonTile';

export class LunaMiningHub extends MoonCard {
  constructor() {
    super({
      name: CardName.LUNA_MINING_HUB,
      cardType: CardType.AUTOMATED,
      tags: [Tags.BUILDING],
      cost: 16,
      productionBox: Units.of({steel: 1, titanium: 1}),

      requirements: CardRequirements.builder((b) => b.miningRate(5)),
      metadata: {
        cardNumber: 'M14',
        description: 'Requires a Mining Rate of 5 or higher. ' +
          'Spend 1 titanium and 1 steel. Increase your steel and titanium production 1 step each. ' +
          'Place this tile on the Moon and raise Mining Rate 1 step. ' +
          '2 ADDITIONAL VPs FOR EACH MINING TILE ADJACENT TO THIS TILE.',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).minus().steel(1).br;
          b.production((pb) => pb.steel(1).titanium(1));
          b.tile(TileType.LUNA_MINING_HUB, true).moonMiningRate(1);
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.questionmark(), // (2, 1),
      },
    }, {
      reserveUnits: Units.of({titanium: 1, steel: 1}),
    });
  };

  public canPlay(player: Player): boolean {
    return MoonExpansion.moonData(player.game).miningRate >= 5;
  }

  public play(player: Player) {
    super.play(player);
    player.game.defer(new PlaceSpecialMoonTile(
      player, {
        tileType: TileType.LUNA_MINING_HUB,
        card: this.name,
      },
      'Select a space for Luna Mining Hub.'));
    MoonExpansion.raiseMiningRate(player);
    return undefined;
  }

  public getVictoryPoints(player: Player) {
    const moonData = MoonExpansion.moonData(player.game);
    const usedSpace = moonData.moon.getSpaceByTileCard(this.name);
    if (usedSpace !== undefined) {
      const adjacentSpaces = moonData.moon.getAdjacentSpaces(usedSpace);
      const adjacentMines = adjacentSpaces.filter((s) => s.tile?.tileType === TileType.MOON_MINE);
      return 2 * adjacentMines.length;
    }
    return 0;
  }
}
