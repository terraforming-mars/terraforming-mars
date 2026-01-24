import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {Board} from '../../boards/Board';
import {SelectPlayer} from '../../inputs/SelectPlayer';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';

export class SubnauticPirates extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SUBNAUTIC_PIRATES,
      type: CardType.EVENT,
      tags: [Tag.CRIME],
      cost: 1,

      requirements: [{undergroundTokens: 1}, {corruption: 1}],

      metadata: {
        cardNumber: 'U011',
        renderData: CardRenderer.builder((b) => {
          b.text('STEAL').megacredits(7).asterix();
        }),
        description: 'Requires you have 1 corruption and 1 underground token. ' +
          'Steal 7 M€ from a player that HAS A TILE NEXT TO AN OCEAN.',
      },
    });
  }

  private availableTargets(player: IPlayer) {
    const targets = new Set<IPlayer>();
    const spaces = player.game.board.getOceanSpaces({upgradedOceans: true, wetlands: true, newHolland: true});
    for (const space of spaces) {
      for (const adjacent of player.game.board.getAdjacentSpaces(space)) {
        if (adjacent.player !== undefined && adjacent.player !== player && Board.hasRealTile(adjacent)) {
          targets.add(adjacent.player);
        }
      }
    }
    return Array.from(targets);
  }

  public override bespokeCanPlay(player: IPlayer) {
    if (player.game.isSoloMode()) {
      return false;
    }
    return this.availableTargets(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    return new SelectPlayer(this.availableTargets(player), 'Select target to steal 7 M€ from').andThen((target) => {
      target.attack(player, Resource.MEGACREDITS, 7, {stealing: true, log: true});
      return undefined;
    });
  }
}
