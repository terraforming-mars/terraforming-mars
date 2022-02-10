import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Resources} from '../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {Units} from '../../common/Units';
import {MoonCard} from './MoonCard';
import {TileType} from '../../common/TileType';

export class LunarIndustryComplex extends MoonCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_INDUSTRY_COMPLEX,
      cardType: CardType.AUTOMATED,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 28,
      productionBox: Units.of({steel: 1, titanium: 1, energy: 2, heat: 1}),
      reserveUnits: Units.of({titanium: 2}),
      tr: {moonMining: 1},

      metadata: {
        description: 'Spend 2 Titanium. Place a mine tile on the Moon and raise the Mining Rate 1 step. ' +
          'Increase your Steel, Titanium, and Heat production 1 step each. Increase your Energy production 2 steps.',
        cardNumber: 'M74',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(2).moonMine().br;
          b.production((pb) => pb.steel(1).titanium(1).heat(1).energy(2));
        }),
      },
    }, {
      tilesBuilt: [TileType.MOON_MINE],
    });
  }

  public override play(player: Player) {
    player.deductUnits(this.reserveUnits);
    player.game.defer(new PlaceMoonMineTile(player));
    player.addProduction(Resources.STEEL, 1);
    player.addProduction(Resources.TITANIUM, 1);
    player.addProduction(Resources.ENERGY, 2);
    player.addProduction(Resources.HEAT, 1);
    return undefined;
  }
}
