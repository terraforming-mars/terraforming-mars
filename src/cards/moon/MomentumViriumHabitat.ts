import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {MoonSpaces} from '../../moon/MoonSpaces';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {TileType} from '../../TileType';
import {MoonCard} from './MoonCard';

export class MomentumViriumHabitat extends MoonCard {
  constructor() {
    super({
      name: CardName.MOMENTUM_VIRUM_HABITAT,
      cardType: CardType.ACTIVE,
      tags: [Tags.CITY, Tags.SPACE],
      cost: 23,
      productionBox: Units.of({heat: 2, megacredits: 3}),

      metadata: {
        description: 'Spend 1 titanium. Increase your heat production 2 steps and your MC production 3 steps. ' +
        'Place a colony tile ON THE RESERVED AREA and raise the Colony Rate 1 step.',
        cardNumber: 'M12',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).br;
          b.production((pb) => {
            pb.heat(2).megacredits(3);
          }).br;
          b.moonColony().asterix();
        }),
      },
    }, {
      reserveUnits: Units.of({titanium: 1}),
      tilesBuilt: [TileType.MOON_COLONY],
    });
  };


  public play(player: Player) {
    super.play(player);
    MoonExpansion.addColonyTile(player, MoonSpaces.MOMENTUM_VIRIUM, this.name);
    MoonExpansion.raiseColonyRate(player);
    return undefined;
  }
}
