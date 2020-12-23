import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {SpaceBonus} from '../../SpaceBonus';
import {CardName} from '../../CardName';
import {TileType} from '../../TileType';
import {Capital} from '../base/Capital';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class CapitalAres extends Capital {
  public name = CardName.CAPITAL_ARES;
  public adjacencyBonus: IAdjacencyBonus = {bonus: [SpaceBonus.MEGACREDITS, SpaceBonus.MEGACREDITS]};
  public metadata: CardMetadata = {
    cardNumber: 'A05',
    description: {
      text: 'Requires 4 ocean tiles. Place tile with ADJACENCY BONUS of 2MC. Energy prod -2 and MC prod +5.',
      align: 'left',
    },
    requirements: CardRequirements.builder((b) => b.oceans(4)),
    renderData: CardRenderer.builder((b) => {
      b.productionBox((pb) => {
        pb.minus().energy(2).br;
        pb.plus().megacredits(5);
      }).nbsp.tile(TileType.CAPITAL, false, true).br;
      b.text('1 additional VP for each ocean tile adjacent to this city tile', CardRenderItemSize.TINY, true);
    }),
    victoryPoints: CardRenderDynamicVictoryPoints.oceans(1, 1),
  }
}
