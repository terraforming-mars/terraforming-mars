import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';

export class CorporateTheft extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.CORPORATE_THEFT,
      type: CardType.EVENT,
      cost: 10,

      requirements: {corruption: 2},

      metadata: {
        cardNumber: 'U61',
        renderData: CardRenderer.builder((b) => {
          b.text('STEAL').wild(1).corruption().asterix();
        }),
        description: 'Requires 2 corruption. Remove 1 resource from a card belonging to a different player. ' +
          'Then, if you have a card that can hold it, put it on such a card. ' +
          // 'If target paid corruption to block this, you gain that corruption.',
          'If the target blocked this, you gain 1 corruption. ' +
          'NOTE: Do not use in single player games.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    if (player.game.isSoloMode()) {
      return false;
    }
    return RemoveResourcesFromCard.getAvailableTargetCards(player, undefined, 'opponents').length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    game.defer(new RemoveResourcesFromCard(player, undefined, 1, {source: 'opponents', blockable: true, autoselect: false})).andThen((response) => {
      if (response.proceed && response.card !== undefined) {
        const type = response.card.resourceType;
        if (player.getResourceCards(type).length > 0) {
          game.defer(new AddResourcesToCard(player, type, {log: true}));
        }
      } else {
        // This is almost right beacuse it's not clear the player used a fighter to block the steal.
        UnderworldExpansion.gainCorruption(player, 1, {log: true});
      }
    });
    return undefined;
  }
}
