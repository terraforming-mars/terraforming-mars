import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {all} from '../Options';
import {RemoveResources} from '../../deferredActions/RemoveResources';
import {Resource} from '../../../common/Resource';
import {Priority} from '../../../server/deferredActions/Priority';

export class SmallComet extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.SMALL_COMET,
      cost: 32,
      tags: [Tag.MARS, Tag.SPACE],

      behavior: {
        stock: {titanium: 1},
        global: {temperature: 1, oxygen: 1},
        ocean: {on: 'land'},
      },

      metadata: {
        cardNumber: 'Pf37',
        renderData: CardRenderer.builder((b) => {
          b.minus().plants(2, {all}).asterix();
          b.br;
          b.temperature(1).oxygen(1).oceans(1).asterix();
          b.br;
          b.titanium(1);
        }),
        description: 'Every player loses 2 plants. Raise the temperature 1 step. Raise the oxygen 1 step. ' +
          'Place an ocean ON AN AREA NOT RESERVED FOR OCEAN. Gain 1 titanium.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    for (const target of game.getPlayers()) {
      game.defer(new RemoveResources(target, player, Resource.PLANTS, 2), Priority.ATTACK_OPPONENT);
    }
    return undefined;
  }
}

