import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {MoonSpaces} from '../../../common/moon/MoonSpaces';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../../common/TileType';
import {Card} from '../Card';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

export class MomentumViriumHabitat extends Card {
  constructor() {
    super({
      name: CardName.MOMENTUM_VIRUM_HABITAT,
      cardType: CardType.AUTOMATED,
      tags: [Tag.CITY, Tag.SPACE],
      cost: 23,

      behavior: {
        production: {heat: 2, megacredits: 3},
        moon: {
          habitatTile: {space: MoonSpaces.MOMENTUM_VIRIUM},
        },
      },
      reserveUnits: {titanium: 1},

      metadata: {
        description: 'Spend 1 titanium. Increase your heat production 2 steps and your M€ production 3 steps. ' +
        'Place a habitat tile ON THE RESERVED AREA and raise the Habitat Rate 1 step.',
        cardNumber: 'M12',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).br;
          b.production((pb) => {
            pb.heat(2).megacredits(3);
          }).br;
          b.moonHabitat({secondaryTag: AltSecondaryTag.MOON_HABITAT_RATE}).asterix();
        }),
      },
      tilesBuilt: [TileType.MOON_HABITAT],
    });
  }
}
