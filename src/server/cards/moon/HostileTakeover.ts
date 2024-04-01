import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../../common/TileType';
import {SelectSpace} from '../../inputs/SelectSpace';

// TODO(kberg): Make compatible with Lunar Mine Urbanization.
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
    return MoonExpansion.spaces(player.game, type).filter((space) => space.player !== player && space.coOwner === undefined);
  }
  public override bespokeCanPlay(player: IPlayer) {
    const habitatSpaces = this.availableSpaces(player, TileType.MOON_HABITAT);
    const mineSpaces = this.availableSpaces(player, TileType.MOON_MINE);
    // TODO(kberg): warn if Lunar Mine Urbanization is one of the few eligibile cards.
    return habitatSpaces.length > 0 && mineSpaces.length > 0;
    // SPECIAL CASE consider Lunar Mine Urbanization
  }

  public override bespokePlay(player: IPlayer) {
    // SPECIAL CASE consider Lunar Mine Urbanization
    const habitatSpaces = this.availableSpaces(player, TileType.MOON_HABITAT);
    return new SelectSpace('Select a habitat space to co-own', habitatSpaces).andThen((space) => {
      space.coOwner = player;
      const mineSpaces = this.availableSpaces(player, TileType.MOON_MINE);
      if (mineSpaces.length === 0) {
        player.game.log('that habitat space is the only available mining space.');
        return undefined;
      }
      return new SelectSpace('Select a mining space to co-own', mineSpaces).andThen((space) => {
        space.coOwner = player;
        return undefined;
      });
    });
  }
}
