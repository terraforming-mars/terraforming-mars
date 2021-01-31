import {SpaceBonus} from '../../SpaceBonus';
import {CardName} from '../../CardName';
import {TileType} from '../../TileType';
import {Capital} from '../base/Capital';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class CapitalAres extends Capital {
  constructor() {
    super(
      CardName.CAPITAL_ARES,
      {bonus: [SpaceBonus.MEGACREDITS, SpaceBonus.MEGACREDITS]},
      {
        cardNumber: 'A05',
        description: {
          text: 'Requires 4 ocean tiles. Place tile with ADJACENCY BONUS of 2MC. Energy prod -2 and MC prod +5.',
          align: 'left',
        },
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(2).br;
            pb.plus().megacredits(5);
          }).nbsp.tile(TileType.CAPITAL, false, true).br;
          b.vpText('1 additional VP for each ocean tile adjacent to this city tile.');
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.oceans(1, 1),
      },
    );
  }
}
