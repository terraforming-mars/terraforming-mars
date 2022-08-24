import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {MoonSpaces} from '../../moon/MoonSpaces';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../../common/Units';
import {TileType} from '../../../common/TileType';
import {MoonCard} from './MoonCard';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

export class MomentumViriumHabitat extends MoonCard {
  constructor() {
    super({
      name: CardName.MOMENTUM_VIRUM_HABITAT,
      cardType: CardType.AUTOMATED,
      tags: [Tag.CITY, Tag.SPACE],
      cost: 23,
      productionBox: Units.of({heat: 2, megacredits: 3}),
      reserveUnits: Units.of({titanium: 1}),
      tr: {moonColony: 1},

      metadata: {
        description: 'Spend 1 titanium. Increase your heat production 2 steps and your M€ production 3 steps. ' +
        'Place a colony tile ON THE RESERVED AREA and raise the Colony Rate 1 step.',
        cardNumber: 'M12',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).br;
          b.production((pb) => {
            pb.heat(2).megacredits(3);
          }).br;
          b.moonColony({secondaryTag: AltSecondaryTag.MOON_COLONY_RATE}).asterix();
        }),
      },
    }, {
      tilesBuilt: [TileType.MOON_COLONY],
    });
  }

  public play(player: Player) {
    MoonExpansion.addColonyTile(player, MoonSpaces.MOMENTUM_VIRIUM, this.name);
    MoonExpansion.raiseColonyRate(player);
    return undefined;
  }
}
