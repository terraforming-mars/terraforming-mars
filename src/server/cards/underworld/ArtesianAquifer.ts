import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {ExcavateSpaceDeferred} from '../../underworld/ExcavateSpaceDeferred';

export class ArtesianAquifer extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ARTESIAN_AQUIFER,
      tags: [Tag.BUILDING],
      cost: 16,

      tr: {oceans: 1},

      metadata: {
        cardNumber: 'U59',
        renderData: CardRenderer.builder((b) => {
          b.excavate().asterix().oceans(1);
        }),
        description: 'Excavate 1 underground resource on ANY SPACE RESERVED FOR AN OCEAN. Then, place an ocean tile there, if possible.',
      },
    });
  }

  private availableSpaces(player: IPlayer) {
    return player.game.board.getAvailableSpacesForOcean(player).filter((space) => space.excavator === undefined);
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    if (!player.game.canAddOcean()) {
      this.warnings.add('maxoceans');
    }
    return this.availableSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new ExcavateSpaceDeferred(player, this.availableSpaces(player)))
      .andThen((space) => {
        if (player.game.board.getAvailableSpacesForOcean(player).includes(space)) {
          player.game.addOcean(player, space);
        } else {
          // TODO(kberg): log about how they player couldn't place an ocean.
        }
      });
    return undefined;
  }
}
