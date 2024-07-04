import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {SpaceName} from '../../SpaceName';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {Space} from '../../boards/Space';
import {Resource} from '../../../common/Resource';
import {all} from '../Options';

const SPACE_CITIES = [
  SpaceName.GANYMEDE_COLONY,
  SpaceName.PHOBOS_SPACE_HAVEN,
  SpaceName.STANFORD_TORUS,
  SpaceName.LUNA_METROPOLIS,
  SpaceName.DAWN_CITY,
  SpaceName.STRATOPOLIS,
  SpaceName.MAXWELL_BASE,
  SpaceName.CERES_SPACEPORT,
  SpaceName.DYSON_SCREENS,
  SpaceName.LUNAR_EMBASSY,
  SpaceName.VENERA_BASE,
  // MARTIAN_TRANSHIPMENT_STATION,
] as const;

type SpaceCity = typeof SPACE_CITIES[number];
const spaceCityNames: Record<SpaceCity, CardName> = {
  [SpaceName.GANYMEDE_COLONY]: CardName.GANYMEDE_COLONY,
  [SpaceName.PHOBOS_SPACE_HAVEN]: CardName.PHOBOS_SPACE_HAVEN,
  [SpaceName.STANFORD_TORUS]: CardName.STANFORD_TORUS,
  [SpaceName.LUNA_METROPOLIS]: CardName.LUNA_METROPOLIS,
  [SpaceName.DAWN_CITY]: CardName.DAWN_CITY,
  [SpaceName.STRATOPOLIS]: CardName.STRATOPOLIS,
  [SpaceName.MAXWELL_BASE]: CardName.MAXWELL_BASE,
  [SpaceName.CERES_SPACEPORT]: CardName.CERES_SPACEPORT,
  [SpaceName.DYSON_SCREENS]: CardName.DYSON_SCREENS,
  [SpaceName.LUNAR_EMBASSY]: CardName.LUNAR_EMBASSY,
  [SpaceName.VENERA_BASE]: CardName.VENERA_BASE,
} as const;


export class StarVegas extends Card {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.STAR_VEGAS,
      cost: 32,
      tags: [Tag.SPACE, Tag.CITY],
      requirements: {cities: 3, all: true},

      behavior: {
        underworld: {
          corruption: 2,
        },
      },

      metadata: {
        cardNumber: 'U53',
        renderData: CardRenderer.builder((b) => {
          b.city().asterix().corruption(2).br;
          b.production((pb) => pb.megacredits(1).slash().city({all}));
        }),
        description: 'Requires any 3 cities in play. Place a city on a space reserved for a different space city. ' +
        'Gain 2 corruption. Increase your M€ production one step for each city in play.',
      },
    });
  }

  private eligibleSpaces(player: IPlayer): ReadonlyArray<Space> {
    const spaces = [];
    for (const spaceId of SPACE_CITIES) {
      try {
        const space = player.game.board.getSpaceOrThrow(spaceId);
        if (space.tile === undefined) {
          spaces.push(space);
        }
      } catch (err) {
        // This occurs with invalid spaces.
      }
    }
    return spaces;
  }

  override bespokeCanPlay(player: IPlayer) {
    return this.eligibleSpaces(player).length > 0;
  }

  override bespokePlay(player: IPlayer) {
    const game = player.game;
    game.defer(new PlaceCityTile(player, {spaces: this.eligibleSpaces(player)})).andThen((space) => {
      if (space !== undefined) {
        const id = space.id as SpaceCity;
        game.log('${0} placed ${1} on ${2}', (b) => b.player(player).cardName(this.name).string(spaceCityNames[id] ?? 'unknown'));
        player.production.add(Resource.MEGACREDITS, (game.board.getCities()).length, {log: true});
        if (space.tile !== undefined) { // Should not happen
          space.tile.card = this.name;
        }
      }
    });
    return undefined;
  }
}

