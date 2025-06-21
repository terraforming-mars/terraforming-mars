import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardResource} from '../../../common/CardResource';
import {CardType} from '../../../common/cards/CardType';
import {Card} from '../Card';
import {all} from '../Options';
import {IActionCard} from '../ICard';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {Resource} from '../../../common/Resource';

export class SpacePrivateers extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.SPACE_PRIVATEERS,
      cost: 10,
      tags: [Tag.CRIME, Tag.SPACE],
      resourceType: CardResource.FIGHTER,
      victoryPoints: -2,
      requirements: {corruption: 3},

      behavior: {
        addResources: 3,
      },

      metadata: {
        cardNumber: 'U50',
        renderData: CardRenderer.builder((b) => {
          b.action('If there is at least 1 fighter on this card, steal 2 M€ from EACH OTHER player.',
            (ab) => ab.empty().startAction.resource(CardResource.FIGHTER).asterix().colon().text('STEAL').megacredits(2, {all})).br;
          b.effect(
            'If 1 or more targets block this with corruption, remove 1 fighter from here.',
            (eb) => eb.corruptionShield().startEffect.minus().resource(CardResource.FIGHTER)).br;
          b.plainText('(Solo: Gain 2 M€ and remove 1 fighter from this card.)').br;
          b.resource(CardResource.FIGHTER, 3);
        }),
        description: 'Requires 3 corruption. Put 3 fighter resources on this card.',
      },
    });
  }
  public data = {
    action: 0,
    rejected: false,
  };

  canAct(): boolean {
    return this.resourceCount > 0;
  }
  action(player: IPlayer): PlayerInput | undefined {
    if (player.game.isSoloMode()) {
      player.stock.add(Resource.MEGACREDITS, 2, {log: true});
      this.resourceCount--;
      player.resolveInsuranceInSoloGame();
      return undefined;
    }

    // TODO(kberg): Attacker should decide attack order.

    // If a player is Mons Insurance, this probably won't go in preferred player order.
    // TODO(kberg): devise a Mons Insurance solution.
    let blocked = false;

    const targets = player.getOpponents();
    const waitingFor = new Set(targets);
    for (const target of targets) {
      target.maybeBlockAttack(player, 'Lose 2 M€', (proceed) => {
        if (proceed) {
          target.stock.steal(Resource.MEGACREDITS, 2, player, {log: true});
          target.resolveInsurance();
        } else {
          blocked = true;
        }
        waitingFor.delete(target);
        if (waitingFor.size === 0 && blocked) {
          player.removeResourceFrom(this, 1, {log: true});
        }
        return undefined;
      });
    }
    return undefined;
  }
}
