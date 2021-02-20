import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';
import {TileType} from '../../TileType';

export class LunarIndustryComplex extends MoonCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_INDUSTRY_COMPLEX,
      cardType: CardType.AUTOMATED,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 28,
      productionBox: Units.of({steel: 1, titanium: 1, energy: 2, heat: 1}),

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
      reserveUnits: Units.of({titanium: 2}),
      tilesBuilt: [TileType.MOON_MINE],
    });
  };

  public play(player: Player) {
    Units.deductUnits(this.reserveUnits, player);
    player.game.defer(new PlaceMoonMineTile(player));
    player.addProduction(Resources.STEEL, 1);
    player.addProduction(Resources.TITANIUM, 1);
    player.addProduction(Resources.ENERGY, 2);
    player.addProduction(Resources.HEAT, 1);
    return undefined;
  }
}
