import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {cancelled} from '../Options';
import {ExcavateSpaceDeferred} from '../../underworld/ExcavateSpaceDeferred';
import {Space} from '../../boards/Space';
import {SelectSpace} from '../../inputs/SelectSpace';

export class InducedTremor extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.INDUCED_TREMOR,
      cost: 6,

      metadata: {
        cardNumber: 'U70',
        renderData: CardRenderer.builder((b) => {
          b.excavate().undergroundResources(1, {cancelled}).asterix();
        }),
        description: 'Excavate an underground resource, then pick an adjacent space with an unclaimed resource token. ' +
          'Remove that token. The space can be identified again.',
      },
    });
  }

  private availableSpaces(player: IPlayer) {
    return UnderworldExpansion.excavatableSpaces(player).filter((space) => {
      return player.game.board.getAdjacentSpaces(space).some((s) => this.eligibleNeighbor(s));
    });
  }

  private eligibleNeighbor(space: Space) {
    return space.undergroundResources === undefined || space.excavator === undefined;
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return this.availableSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    game.defer(
      new ExcavateSpaceDeferred(player, this.availableSpaces(player)).andThen((space) => {
        const eligibleNeighbors = game.board.getAdjacentSpaces(space).filter((s) => this.eligibleNeighbor(s));
        player.defer(new SelectSpace('Select unclaimed resource token to remove', eligibleNeighbors).andThen((s) => {
          UnderworldExpansion.removeUnclaimedToken(game, s);
          return undefined;
        }));
      }));
    return undefined;
  }
}
