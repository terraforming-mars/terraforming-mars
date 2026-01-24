import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {SelectResource} from '../../inputs/SelectResource';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {Units} from '../../../common/Units';
import {message} from '../../logs/MessageBuilder';
import {Tag} from '../../../common/cards/Tag';
import {IActionCard} from '../ICard';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';

export class Monopoly extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MONOPOLY,
      tags: [Tag.CRIME],
      cost: 8,

      requirements: {corruption: 2},
      victoryPoints: -2,

      metadata: {
        cardNumber: 'U065',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 corruption to increase any production 1 step.', (ab) => {
            ab.corruption(1).startAction.production((pb) => pb.wild(1));
          }).br;
          b.text('STEAL').wild(2, {all}).asterix().br;
        }),
        description: 'Requires 2 corruption. Choose a standard resource type. ' +
          'Steal 2 units of that resource from EACH OTHER player.',
      },
    });
  }

  private stealableResources(player: IPlayer): ReadonlyArray<keyof Units> {
    if (player.game.isSoloMode()) {
      return Units.keys;
    }
    const targets = player.opponents;
    return Units.keys.filter((unit) => {
      return targets.some((target) => target.stock[unit] > 0 && !target.isProtected(unit));
    });
  }

  public override bespokeCanPlay(player: IPlayer) {
    return this.stealableResources(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    return new SelectResource(
      'Select which production to increase 1 step.',
      this.stealableResources(player))
      .andThen((unitKey) => {
        const resource = Units.ResourceMap[unitKey];
        if (player.game.isSoloMode()) {
          player.stock.add(resource, 2, {log: true});
          player.resolveInsuranceInSoloGame();
          return undefined;
        }
        for (const target of player.opponents) {
          if (!target.isProtected(resource) && target.stock[resource] > 0) {
            const msg = message('Lose ${0} ${1}', (b) => b.number(2).string(resource));
            target.maybeBlockAttack(player, msg, (proceed: boolean) => {
              if (proceed) {
                target.stock.steal(resource, 2, player, {log: true});
                // TODO(kberg): Confirm this is done.
                // target.resolveInsurance();
              }
              return undefined;
            });
          }
        }
        return undefined;
      });
  }

  public canAct(player: IPlayer): boolean {
    return player.underworldData.corruption > 0;
  }

  public action(player: IPlayer) {
    return new SelectResource(
      'Select which resource type to steal 2 units from all other players.')
      .andThen((unitKey) => {
        UnderworldExpansion.loseCorruption(player, 1);
        const units = {...Units.EMPTY};
        units[unitKey] = 1;
        player.production.adjust(units, {log: true});
        return undefined;
      });
  }
}

