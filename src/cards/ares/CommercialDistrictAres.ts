import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {CardName} from '../../common/cards/CardName';
import {CommercialDistrict} from '../base/CommercialDistrict';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../common/TileType';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';


export class CommercialDistrictAres extends CommercialDistrict {
  constructor() {
    super(
      CardName.COMMERCIAL_DISTRICT_ARES,
      {bonus: [SpaceBonus.MEGACREDITS, SpaceBonus.MEGACREDITS]},
      {
        cardNumber: 'A06',
        description: 'Place this tile which grants an ADJACENCY BONUS of 2 M€. Decrease your energy production 1 step and increase your M€ production 4 steps.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(4).br;
          }).nbsp.nbsp.tile(TileType.COMMERCIAL_DISTRICT, false, true).br;
          b.vpText('1 VP per adjacent city tile.');
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.cities(1, 1),
      });
  }
}
