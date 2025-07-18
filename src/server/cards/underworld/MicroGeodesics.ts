import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {digit} from '../Options';
import {IActionCard} from '../ICard';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {Resource} from '../../../common/Resource';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {SelectClaimedToken} from '../../inputs/SelectClaimedToken';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';

export class MicroGeodesics extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MICRO_GEODESICS,
      tags: [Tag.MICROBE, Tag.PLANT],
      resourceType: CardResource.MICROBE,
      cost: 8,

      behavior: {
        underworld: {excavate: {count: 1}},
        addResources: 1,
      },

      metadata: {
        cardNumber: 'U056',
        renderData: CardRenderer.builder((b) => {
          b.minus().resource(CardResource.MICROBE).excavate().plants(3, {digit}).resource(CardResource.DATA).asterix();
        }),
        description: 'Spend 1 microbe from any card to excavate an underground resource and gain 3 plants. Add 1 data resource to ANOTHER card.',
      },
    });
  }
  canAct(player: IPlayer): boolean {
    if (player.underworldData.tokens.length < 1) {
      return false;
    }
    // TODO(kberg): Warn if you can only discard useful tokens.
    if (player.getResourceCount(CardResource.MICROBE) < 0) {
      return false;
    }

    return true;
  }
  action(player: IPlayer): PlayerInput | undefined {
    player.game.defer(
      new RemoveResourcesFromCard(player, CardResource.FLOATER, 1, {source: 'self', blockable: false})
        .andThen((response) => {
          if (response.proceed) {
            player.defer(new SelectClaimedToken('Select a token to discard', player.underworldData.tokens)
              .andThen(([token]) => {
                UnderworldExpansion.removeClaimedToken(player, token);
                player.stock.add(Resource.PLANTS, 3);
                return undefined;
              }));
          }
          return undefined;
        }),
    );

    throw new Error('Method not implemented.');
  }
}
