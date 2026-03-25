import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {Tag} from '../../../common/cards/Tag';
import {OrOptions} from '../../inputs/OrOptions';
import {ALL_RESOURCES} from '../../../common/Resource';
import {SelectOption} from '../../inputs/SelectOption';
import {message} from '../../logs/MessageBuilder';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {IActionCard} from '../ICard';

export class CorporateTheft extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      name: CardName.CORPORATE_THEFT,
      type: CardType.ACTIVE,
      tags: [Tag.CRIME],
      cost: 10,

      requirements: {corruption: 2},
      victoryPoints: -1,

      metadata: {
        cardNumber: 'U061',
        renderData: CardRenderer.builder((b) => {
          b.action('Pay 5 M€ to steal ANY 1 resource from another player. ' +
          'If it is a card resource, you may put it on a suitable card.',
          (ab) => ab.megacredits(5).startAction.text('STEAL').wild(1).asterix());
          b.br.text('DOES NOT WORK IN SOLO GAMES');
        }),
        description: 'Requires 2 corruption.',
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    // Could also confirm that opponents have any resources, corruption, or resource cards.
    // Must take into account blocking abilities.
    return !player.game.isSoloMode() && player.canAfford(5);
  }

  public action(player: IPlayer) {
    const game = player.game;
    const options = new OrOptions().setTitle('Select one option').andThen(() => {
      player.game.defer(new SelectPaymentDeferred(player, 5));
      return undefined;
    });

    // TODO(kberg): Copy from Clone Troopers
    for (const resource of ALL_RESOURCES) {
      for (const target of player.opponents) {
        if (target.isProtected(resource) || target.stock.get(resource) < 1) {
          continue;
        }
        options.options.push(new SelectOption(
          message('Steal 1 ${0} from ${1}', (b) => b.string(resource).player(target)),
          'Steal ' + resource)
          .andThen(() => {
            target.attack(player, resource, 1, {log: true, stealing: true});
            return undefined;
          }));
      }
    }
    for (const target of player.opponents) {
      if (target.underworldData.corruption > 0) {
        options.options.push(new SelectOption(
          message('Steal 1 ${0} from ${1}', (b) => b.string('corruption').player(target)),
          'Steal corruption')
          .andThen(() => {
            target.maybeBlockAttack(player, message('${0} corruption', (b) => b.number(1)), (proceed: boolean) => {
              if (proceed) {
                UnderworldExpansion.loseCorruption(target, 1);
                UnderworldExpansion.gainCorruption(player, 1, {log: true});
              }
              return undefined;
            });
            return undefined;
          }));
      }
    }
    const removeResourcesFromCard = new RemoveResourcesFromCard(player, undefined, 1, {source: 'opponents', blockable: true, autoselect: false}).andThen((response) => {
      if (response.proceed && response.card !== undefined) {
        const type = response.card.resourceType;
        if (player.getResourceCards(type).length > 0) {
          game.defer(new AddResourcesToCard(player, type, {log: true}));
        }
      }
    });

    const action = removeResourcesFromCard.execute();
    if (action !== undefined) {
      options.options.push(action);
    }
    return options;
  }
}
