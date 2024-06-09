import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {SelectAmount} from '../../inputs/SelectAmount';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {IdentifySpacesDeferred} from '../../underworld/IdentifySpacesDeferred';

export class Microgravimetry extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MICROGRAVIMETRY,
      tags: [Tag.POWER, Tag.SCIENCE],
      cost: 5,
      resourceType: CardResource.DATA,
      victoryPoints: {resourcesHere: {}, per: 4},

      metadata: {
        cardNumber: 'X42',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend any amount of energy to identify that many underground resources on the board ' +
            'and put the same number of data on this card.', (eb) => {
            eb.text('X').energy(1).startAction.text('X').identify(1).resource(CardResource.DATA);
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.energy > 0 && UnderworldExpansion.identifiableSpaces(player).length > 0;
  }

  public action(player: IPlayer) {
    return new SelectAmount(
      'Select amount of energy to spend', undefined, 1, player.energy)
      .andThen((amount) => {
        player.stock.deduct(Resource.ENERGY, amount);
        player.game.log('${0} spent ${1} energy', (b) => b.player(player).number(amount));
        player.addResourceTo(this, {qty: amount, log: true});
        player.game.defer(new IdentifySpacesDeferred(player, amount));
        return undefined;
      });
  }
}
