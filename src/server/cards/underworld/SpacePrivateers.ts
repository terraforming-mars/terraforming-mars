import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardResource} from '../../../common/CardResource';
import {CardType} from '../../../common/cards/CardType';
import {Card} from '../Card';
import {IActionCard, ICard} from '../ICard';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {Resource} from '../../../common/Resource';
import {message} from '../../logs/MessageBuilder';

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

      metadata: {
        cardNumber: 'U050',
        renderData: CardRenderer.builder((b) => {
          b.effect('Whenever you play a crime tag, including this, put 1 fighter on this card.', (ab) => {
            ab.tag(Tag.CRIME).startAction.resource(CardResource.FIGHTER);
          }).br;
          b.action(
            'For each fighter here, steal 1 M€ from EACH OTHER player. ' +
            // 'For each corruption spent to block this, remove 1 fighter from here.',
            'For each player that blocks this, remove 1 fighter from here.',
            (ab) => ab.empty().startAction.text('STEAL').megacredits(1).asterix().slash().resource(CardResource.FIGHTER)).br;
          b.corruptionShield().text(':').minus().resource(CardResource.FIGHTER).br;
          b.plainText('DO NOT USE FOR SOLO').br;
        }),
        description: 'Requires 3 corruption.',
      },
    });
  }
  public data = {
    action: 0,
    rejected: false,
  };

  canAct(player: IPlayer): boolean {
    return this.resourceCount > 0 && player.game.isSoloMode() === false;
  }

  action(player: IPlayer): PlayerInput | undefined {
    // TODO(kberg): Attacker should decide attack order.

    // If a player is Mons Insurance, this probably won't go in preferred player order.
    // TODO(kberg): devise a Mons Insurance solution.

    const targets = player.opponents;
    const mc = this.resourceCount;
    for (const target of targets) {
      target.maybeBlockAttack(player, message('Lose ${0} M€', (b) => b.number(mc)), (proceed) => {
        if (proceed) {
          target.stock.steal(Resource.MEGACREDITS, mc, player, {log: true});
        } else {
          player.removeResourceFrom(this, 1, {log: true});
        }
        return undefined;
      });
    }
    return undefined;
  }

  onCardPlayed(player: IPlayer, card: ICard): PlayerInput | undefined | void {
    const tags = card.tags.filter((tag) => tag === Tag.CRIME).length;
    player.addResourceTo(this, {qty: tags, log: true});
  }
}
