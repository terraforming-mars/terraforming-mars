import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {IActionCard} from '../ICard';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {SelectClaimedUndergroundToken} from '../../inputs/SelectClaimedUndergroundToken';
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
          b.action('Spend 1 microbe from ANY card and discard 1 of your claimed underground resource tokens to gain 3 plants.', (ab) => {
            ab.resource(CardResource.MICROBE).asterix().undergroundResources().startAction.plants(3);
          }).br;
          b.excavate().resource(CardResource.MICROBE);
        }),
        description: 'Excavate an underground resource. Put 1 microbe on this card.',
      },
    });
  }
  canAct(player: IPlayer): boolean {
    if (player.underworldData.tokens.length < 1) {
      return false;
    }
    if (player.underworldData.tokens.every((t) => t.shelter || t.active)) {
      this.warnings.add('underworldtokendiscard');
    }

    if (player.getResourceCount(CardResource.MICROBE) <= 0) {
      return false;
    }

    return true;
  }
  public action(player: IPlayer) {
    player.game.defer(
      new RemoveResourcesFromCard(player, CardResource.MICROBE, 1, {source: 'self', blockable: false})
        .andThen((response) => {
          if (response.proceed) {
            player.defer(new SelectClaimedUndergroundToken(player.underworldData.tokens, 1)
              .setTitle('Select a token to discard')
              .andThen(([idx]) => {
                UnderworldExpansion.removeClaimedToken(player, idx);
                player.stock.add(Resource.PLANTS, 3);
                return undefined;
              }));
          }
          return undefined;
        }),
    );
    return undefined;
  }
}
