import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../../common/TileType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Space} from '../../boards/Space';

export class HostileTakeover extends Card {
  constructor() {
    super({
      name: CardName.HOSTILE_TAKEOVER,
      type: CardType.EVENT,
      tags: [Tag.CITY, Tag.MOON],
      cost: 26,
      requirements: [{habitatRate: 2}, {miningRate: 4}],

      behavior: {
        production: {megacredits: 2},
      },

      metadata: {
        cardNumber: 'M64',
        renderData: CardRenderer.builder((b) => {
          b.moonHabitat().asterix().moonMine().asterix().production((pb) => pb.megacredits(2));
        }),
        description: 'Requires a habitat rate of 2 or higher, and a mining rate of 4 or higher. ' +
          'Add your player marker to a habitat tile and a mining tile owned by any opponent. ' +
          'Those now also count as yours. Increase your M€ production 2 steps.',
      },
    });
  }

  private availableSpaces(player: IPlayer, type: TileType) {
    return MoonExpansion.spaces(player.game, type, {upgradedTiles: false})
      .filter((space) => space.player !== player && space.coOwner === undefined);
  }
  public override bespokeCanPlay(player: IPlayer) {
    const habitatSpaces = this.availableSpaces(player, TileType.MOON_HABITAT);
    const mineSpaces = this.availableSpaces(player, TileType.MOON_MINE);
    const lunarMineUrbanizationSpaces = this.availableSpaces(player, TileType.LUNAR_MINE_URBANIZATION);
    // TODO(kberg): warn if Lunar Mine Urbanization is one of the few eligibile cards.
    if (habitatSpaces.length > 0 && mineSpaces.length > 0) {
      return true;
    }
    if (habitatSpaces.length + mineSpaces.length > 0 && lunarMineUrbanizationSpaces.length > 0) {
      return true;
    }
    return false;
  }

  public override bespokePlay(player: IPlayer) {
    const habitatSpaces = this.availableSpaces(player, TileType.MOON_HABITAT);
    const mineSpaces = this.availableSpaces(player, TileType.MOON_MINE);

    // It is expected that Lunar Mine Urbanization cannot be played twice.
    let lunarMineUrbanizationSpace: Space | undefined = this.availableSpaces(player, TileType.LUNAR_MINE_URBANIZATION)[0];

    if (lunarMineUrbanizationSpace !== undefined) {
      if (mineSpaces.length === 0) {
        mineSpaces.push(lunarMineUrbanizationSpace);
        lunarMineUrbanizationSpace = undefined;
      } else {
        habitatSpaces.push(lunarMineUrbanizationSpace);
      }
    }

    return new SelectSpace('Select a habitat space to co-own', habitatSpaces).andThen((space) => {
      space.coOwner = player;
      if (space.id === lunarMineUrbanizationSpace?.id) {
        lunarMineUrbanizationSpace = undefined;
      } else {
        if (lunarMineUrbanizationSpace !== undefined) {
          mineSpaces.push(lunarMineUrbanizationSpace);
        }
      }
      return new SelectSpace('Select a mining space to co-own', mineSpaces).andThen((space) => {
        space.coOwner = player;
        return undefined;
      });
    });
  }
}
