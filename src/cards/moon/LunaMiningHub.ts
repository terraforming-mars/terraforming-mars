import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../common/TileType';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Units} from '../../common/Units';
import {MoonCard} from './MoonCard';
import {PlaceSpecialMoonTile} from '../../moon/PlaceSpecialMoonTile';
import {Size} from '../render/Size';

export class LunaMiningHub extends MoonCard {
  constructor() {
    super({
      name: CardName.LUNA_MINING_HUB,
      cardType: CardType.AUTOMATED,
      tags: [Tags.BUILDING],
      cost: 16,

      productionBox: Units.of({steel: 1, titanium: 1}),
      reserveUnits: Units.of({steel: 1, titanium: 1}),
      tr: {moonMining: 1},
      victoryPoints: 'special',
      requirements: CardRequirements.builder((b) => b.miningRate(5)),

      metadata: {
        cardNumber: 'M14',
        description: {
          text: '2 VP PER MINING TILE ADJACENT TO THIS TILE.',
          align: 'left',
        },
        renderData: CardRenderer.builder((b) => {
          b.text('Requires a Mining Rate of 5 or higher.', Size.TINY, false, false).br;
          b.minus().steel(1).minus().titanium(1).production((pb) => pb.steel(1).titanium(1)).br;
          b.text('Spend 1 steel and 1 titanium and raise your steel and titanium production 1 step.', Size.TINY, false, false).br;
          b.tile(TileType.LUNA_MINING_HUB, true).moonMiningRate({size: Size.SMALL});
          b.text('Place this tile on the Moon and raise the Mining Rate 1 step.', Size.TINY, false, false);
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.moonMiningTile(2, true),
      },
    });
  }

  public override play(player: Player) {
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

  public override getVictoryPoints(player: Player) {
    const moonData = MoonExpansion.moonData(player.game);
    const usedSpace = moonData.moon.getSpaceByTileCard(this.name);
    if (usedSpace !== undefined) {
      const adjacentSpaces = moonData.moon.getAdjacentSpaces(usedSpace);
      const adjacentMines = adjacentSpaces.filter((s) => MoonExpansion.spaceHasType(s, TileType.MOON_MINE));
      return 2 * adjacentMines.length;
    }
    return 0;
  }
}
