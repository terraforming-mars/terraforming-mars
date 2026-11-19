import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {digit} from '../Options';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Resource} from '../../../common/Resource';

export class GuerillaEcologists extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.GUERILLA_ECOLOGISTS,
      cost: 9,
      tags: [Tag.PLANT],

      requirements: {corruption: 1},

      metadata: {
        cardNumber: 'U089',
        renderData: CardRenderer.builder((b) => {
          b.plants(-4, {digit}).greenery().asterix();
        }),
        // description: 'Requires 1 corruption and that you lose 4 plants. Place a greenery tile IGNORING ADJACENCY RESTRICTIONS.',
        description: 'Requires 1 corruption. Spend 4 plants to place a greenery tile IGNORING ADJACENCY RESTRICTIONS.',
      },
    });
  }

  private availableSpaces(player: IPlayer): ReadonlyArray<Space> {
    return player.game.board.getAvailableSpacesOnLand(player);
  }

  public override bespokeCanPlay(player: IPlayer) {
    if (player.plants >= 4 || (player.plants >= 3 && player.tableau.has(CardName.VIRAL_ENHANCERS))) {
      return this.availableSpaces(player).length > 0;
    }
    return false;
  }

  public override bespokePlay(player: IPlayer) {
    const availableSpaces = this.availableSpaces(player);
    if (availableSpaces.length === 0) {
      return undefined;
    }

    // Viral Enhancers gives the replacement plant after this cost is applied.
    // Keep the temporary deficit so that existing card interactions continue to work.
    player.plants -= 4;
    player.game.log('${0} lost ${1}${2}', (b) => b.player(player).number(4).resource(Resource.PLANTS));
    return new SelectSpace('Select space for greenery tile', availableSpaces)
      .andThen((space) => {
        player.game.addGreenery(player, space);
        return undefined;
      });
  }
}
