import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {RemoveResources} from '../../deferredActions/RemoveResources';
import {Resource} from '../../../common/Resource';
import {all} from '../Options';

export class PlantTax extends Card implements IProjectCard {
  public generationUsed: number = -1;

  constructor() {
    super({
      name: CardName.PLANT_TAX,
      type: CardType.EVENT,
      cost: 7,

      behavior: {
        underworld: {corruption: 1},
      },

      metadata: {
        cardNumber: 'U067',
        renderData: CardRenderer.builder((b) => {
          b.minus().plants(2, {all}).asterix().nbsp.nbsp.corruption();
        }),
        description: 'ALL players lose 2 plants. Players can block this with corruption. Gain 1 corruption.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    for (const target of game.players) {
      game.defer(new RemoveResources(target, player, Resource.PLANTS, 2));
    }
    return undefined;
  }
}
