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

export class Monopoly extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.MONOPOLY,
      tags: [Tag.CRIME],
      cost: 12,

      requirements: {corruption: 3},
      victoryPoints: -2,

      metadata: {
        cardNumber: 'U65',
        renderData: CardRenderer.builder((b) => {
          b.text('STEAL').production((pb) => pb.wild(1, {all})).br;
        }),
        description: 'Requires 3 corruption. Choose a standard production type. ' +
          'Steal up to 1 unit of that production from EACH OTHER player. They can block this with corruption.',
      },
    });
  }

  private availableProductions(player: IPlayer): Array<keyof Units> {
    const targets = player.getOpponents();
    return Units.keys.filter((unit) => {
      const resource = Units.ResourceMap[unit];
      return targets.some((target) => target.canHaveProductionReduced(resource, 1, player));
    });
  }

  public override bespokeCanPlay(player: IPlayer) {
    return this.availableProductions(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    return new SelectResource(
      'Select which resource type to steal from all other players.',
      this.availableProductions(player))
      .andThen((unitKey) => {
        const resource = Units.ResourceMap[unitKey];
        if (player.game.isSoloMode()) {
          player.production.add(resource, 1, {log: true});
          player.resolveInsuranceInSoloGame();
          return undefined;
        }
        for (const target of player.getOpponents()) {
          if (target.canHaveProductionReduced(resource, 1, player)) {
            const msg = message('Lose ${0} ${1} production', (b) => b.number(1).string(resource));
            target.maybeBlockAttack(player, msg, (proceed: boolean) => {
              if (proceed) {
                target.production.add(resource, -1, {log: true, from: player, stealing: true});
                player.production.add(resource, 1, {log: false});
                target.resolveInsurance();
              }
              return undefined;
            });
          }
        }
        return undefined;
      });
  }
}

