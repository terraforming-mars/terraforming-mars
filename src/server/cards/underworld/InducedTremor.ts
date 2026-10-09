import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {cancelled} from '../Options';
import {SelectSpace} from '../../inputs/SelectSpace';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';


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
        description: 'You may discard 1 underground resource of your choice from the board. Then excavate an underground resource.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return UnderworldExpansion.excavatableSpaces(player).length > 0;
  }

  private excavate(player: IPlayer) {
    return new SelectSpace('Select space to excavate', UnderworldExpansion.excavatableSpaces(player))
      .andThen((excavatedSpace) => {
        UnderworldExpansion.excavate(player, excavatedSpace);
        return undefined;
      });
  }

  public override bespokePlay(player: IPlayer) {
    const identifiedSpaces = player.game.board.spaces.filter((space) => space.undergroundResources !== undefined);
    if (identifiedSpaces.length === 0) {
      player.defer(this.excavate(player));
      return undefined;
    }

    player.defer(new OrOptions(
      new SelectSpace('Select unclaimed resource token to remove', identifiedSpaces).andThen((space) => {
        UnderworldExpansion.removeTokenFromSpace(player.game, space);
        return this.excavate(player);
      }),
      new SelectOption('Do not remove resource').andThen(() => this.excavate(player)),
    ));

    return undefined;
  }
}
