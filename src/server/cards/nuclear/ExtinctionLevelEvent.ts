import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';

import {CardRenderer} from '../render/CardRenderer';
import {all, digit} from '../Options';

export class ExtinctionLevelEvent extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.EXTINCION_LEVEL_EVENT,
      tags: [Tag.SPACE],
      cost: 27,

      behavior: {
        global: {temperature: 2},
      },

      metadata: {
        cardNumber: 'N47',
        renderData: CardRenderer.builder((b) => {
          b.temperature(2).radiations(3, {digit}).asterix().br;
          b.minus().microbes(2, {all, digit}).minus().animals(2, {all, digit});
        }),
        description: 'Increase temperature 2 steps. Remove 2 microbes from any player. Remove 2 animals from any player. Add 3 radiation to another card.',
      },
    });
  }

  public override bespokeCanPlay(): boolean {
    return true
  }

  public override bespokePlay(player: Player) {
    player.game.defer(new RemoveResourcesFromCard(player, CardResource.ANIMAL, 2, false, false));
    player.game.defer(new AddResourcesToCard(player, CardResource.RADIATION, {count: 3}));
    player.game.defer(new RemoveResourcesFromCard(player, CardResource.MICROBE, 2, false, false));
    return undefined;
  }
}
