import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {cancelled} from '../Options';
import {SelectSpace} from '../../inputs/SelectSpace';


export class InducedTremor extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.INDUCED_TREMOR,
      cost: 5,

      metadata: {
        cardNumber: 'U070',
        renderData: CardRenderer.builder((b) => {
          b.undergroundResources(1, {cancelled}).asterix().excavate();
        }),
        // TODO(kberg) make discard optional
        description: 'Discard 1 underground resource from the board. Then excavate an underground resource.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return player.game.board.spaces.some((space) => space.undergroundResources !== undefined) &&
      UnderworldExpansion.excavatableSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    const identifiedSpaces = game.board.spaces.filter((space) => space.undergroundResources !== undefined);
    player.defer(new SelectSpace('Select unclaimed resource token to remove', identifiedSpaces).andThen((space) => {
      UnderworldExpansion.removeTokenFromSpace(game, space);
      return new SelectSpace('Select space to excavate',
        UnderworldExpansion.excavatableSpaces(player))
        .andThen((excavatedSpace) => {
          UnderworldExpansion.excavate(player, excavatedSpace);
          return undefined;
        });
    }));

    return undefined;
  }
}
