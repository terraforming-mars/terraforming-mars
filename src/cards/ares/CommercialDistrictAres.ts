import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {SpaceBonus} from '../../SpaceBonus';
import {CardName} from '../../CardName';
import {CommercialDistrict} from '../CommercialDistrict';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../TileType';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';


export class CommercialDistrictAres extends CommercialDistrict {
  public name = CardName.COMMERCIAL_DISTRICT_ARES;
  public adjacencyBonus: IAdjacencyBonus = {bonus: [SpaceBonus.MEGACREDITS, SpaceBonus.MEGACREDITS]};
  public metadata: CardMetadata = {
    cardNumber: 'A06',
    description: 'Decrease your energy production 1 step and increase your MC production 4 steps',
    renderData: CardRenderer.builder((b) => {
      b.productionBox((pb) => {
        pb.minus().energy(1).br;
        pb.plus().megacredits(4).br;
      }).nbsp.nbsp.tile(TileType.COMMERCIAL_DISTRICT, false, true).br;
      b.text('Place this tile which grants an adjacency bonus of 2MC. 1 vp per adjacent city', CardRenderItemSize.TINY, true);
    }),
    victoryPoints: CardRenderDynamicVictoryPoints.cities(1, 1),
  };
}
