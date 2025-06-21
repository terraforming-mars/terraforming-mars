import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {all, digit} from '../Options';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {message} from '../../logs/MessageBuilder';
import {AndOptions} from '../../inputs/AndOptions';
import {SelectAmount} from '../../inputs/SelectAmount';
import {Resource} from '../../../common/Resource';
import {sum} from '../../../common/utils/utils';
import {Message} from '../../../common/logs/Message';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {Priority} from '../../deferredActions/Priority';

export class RoadPiracy extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.ROAD_PIRACY,
      type: CardType.EVENT,
      tags: [Tag.MOON],
      cost: 10,
      requirements: {logisticRate: 3},

      metadata: {
        description: 'Requires 3 logistic rate. ' +
          'Steal up to 6 steel or 4 titanium from other players. ' +
          '(Resources may be stolen from more than 1 opponent.)',
        cardNumber: 'M54',
        renderData: CardRenderer.builder((b) => {
          b.text('STEAL').steel(6, {all}).slash().titanium(4, {all, digit}).asterix();
        }),
      },
    });
  }

  private generateOption(player: IPlayer, resource: Resource, title: Message, limit: number) {
    const selectAmounts = [];
    const ledger: Map<IPlayer, number> = new Map();
    for (const opponent of player.getOpponents()) {
      if (opponent.stock.get(resource) > 0 && !opponent.alloysAreProtected()) {
        const selectAmount =
          new SelectAmount(
            message('${0}', (b) => b.player(opponent)), undefined, 0, opponent.stock.get(resource))
            .andThen((amount: number) => {
              ledger.set(opponent, amount);
              return undefined;
            });
        selectAmounts.push(selectAmount);
      }
    }
    if (selectAmounts.length === 0) {
      return undefined;
    }

    const cb = () => {
      const total = sum(Array.from(ledger.values()));
      if (total > limit) {
        // throw new Error(newMessage('You may only steal up to ${0} ${1} from all players', (b) => b.number(limit).string(resource)));
        ledger.clear();
        throw new Error(`You may only steal up to ${limit} ${resource} from all players`);
      }
      for (const [target, count] of ledger) {
        if (count > 0) {
          target.attack(player, resource, count, {stealing: true});
        }
      }
      return undefined;
    };
    return new AndOptions(...selectAmounts).andThen(cb).setTitle(title);
  }


  public override bespokePlay(player: IPlayer) {
    player.game.defer(new SimpleDeferredAction(player, () => this.do(player)), Priority.ATTACK_OPPONENT);
    return undefined;
  }

  public do(player: IPlayer) {
    const game = player.game;
    const stealSteel = message('Steal ${0} steel', (b) => b.number(6));
    const stealTitanium = message('Steal ${0} titanium', (b) => b.number(4));
    if (game.isSoloMode()) {
      return new OrOptions(
        new SelectOption(stealSteel, 'Steal steel').andThen(() => {
          player.steel += 6;
          return undefined;
        }),
        new SelectOption(stealTitanium, 'Steal titanium').andThen(() => {
          player.titanium += 4;
          return undefined;
        }),
      );
    }

    const options = new OrOptions();

    const steelOption = this.generateOption(player, Resource.STEEL, stealSteel, 6);
    if (steelOption !== undefined) {
      options.options.push(steelOption);
    }

    const titaniumOption = this.generateOption(player, Resource.TITANIUM, stealTitanium, 4);
    if (titaniumOption !== undefined) {
      options.options.push(titaniumOption);
    }

    if (options.options.length === 0) {
      return undefined;
    }

    options.options.push(new SelectOption('Do not steal'));
    return options;
  }
}
