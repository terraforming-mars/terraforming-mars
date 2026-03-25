import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {SelectSpace} from '../../inputs/SelectSpace';

export class ArtesianAquifer extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ARTESIAN_AQUIFER,
      tags: [Tag.BUILDING],
      cost: 16,

      tr: {oceans: 1},

      metadata: {
        cardNumber: 'U059',
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
    return new SelectSpace('Select space to excavate and place ocean',
      this.availableSpaces(player))
      .andThen((space) => {
        UnderworldExpansion.excavate(player, space);
        player.game.addOcean(player, space);
        return undefined;
      });
  }
}
