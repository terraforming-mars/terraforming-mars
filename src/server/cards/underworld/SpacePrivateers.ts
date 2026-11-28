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
import {all} from '../Options';
import {OrOptions} from '@/server/inputs/OrOptions';
import {SelectOption} from '@/server/inputs/SelectOption';
import {SelectPlayer} from '@/server/inputs/SelectPlayer';

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
            'Steal up to 1 M€ per fighter here, from EACH OTHER player. ' +
            // 'For each corruption spent to block this, remove 1 fighter from here.',
            'For each player that blocks this, remove 1 fighter from here.',
            (ab) => ab.empty().startAction.text('STEAL').megacredits(1, {all}).asterix().slash().resource(CardResource.FIGHTER)).br;
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
    return this.selectNextTarget(player, player.opponents, this.resourceCount);
  }

  /*
   * Players in `remaining` that can still be attacked.
   */
  private targets(remaining: ReadonlyArray<IPlayer>): ReadonlyArray<IPlayer> {
    if (this.resourceCount === 0) {
      return [];
    }
    return remaining.filter((p) => p.megaCredits > 0);
  }

  /*
   * Asks `player` which of `remaining` to attack next, one target at a time.
   *
   * Each attack resolves completely before the next choice.
   */
  private selectNextTarget(player: IPlayer, remaining: ReadonlyArray<IPlayer>, mc: number): PlayerInput | undefined {
    const targets = this.targets(remaining);
    if (targets.length <= 1) {
      this.attackInOrder(player, remaining, mc);
      return undefined;
    }
    return new OrOptions(
      new SelectPlayer(targets, 'Select player', 'Attack')
        .andThen((target) => {
          const rest = remaining.filter((p) => p !== target);
          this.attack(player, target, rest, mc, () => this.selectNextTarget(player, rest, mc));
          return undefined;
        }),
      new SelectOption('Attack the remaining players in any order', 'Attack')
        .andThen(() => {
          this.attackInOrder(player, remaining, mc);
          return undefined;
        }),
    ).setTitle('Select the next player to attack');
  }

  /* Attacks `remaining` in order, one at a time, without asking `player`. */
  private attackInOrder(player: IPlayer, remaining: ReadonlyArray<IPlayer>, mc: number) {
    const target = this.targets(remaining)[0];
    if (target === undefined) {
      return;
    }
    const rest = remaining.filter((p) => p !== target);
    this.attack(player, target, rest, mc, () => {
      this.attackInOrder(player, rest, mc);
      return undefined;
    });
  }

  /*
   * Attacks `target`, then gives `player` the input from `next`.
   *
   * `rest` are the players still waiting to be attacked.
   */
  private attack(player: IPlayer, target: IPlayer, rest: ReadonlyArray<IPlayer>, mc: number, next: () => PlayerInput | undefined) {
    target.maybeBlockAttack(player, message('Lose ${0} M€', (b) => b.number(mc)), (proceed) => {
      if (proceed) {
        target.stock.steal(Resource.MEGACREDITS, mc, player, {log: true});
      } else {
        player.removeResourceFrom(this, 1, {log: true});
        if (this.resourceCount === 0 && rest.some((p) => p.megaCredits > 0)) {
          player.game.log('${0} has no fighters left on ${1}, so the attack ends', (b) => b.player(player).card(this));
        }
      }
      player.defer(next);
      return undefined;
    });
  }

  onCardPlayed(player: IPlayer, card: ICard): PlayerInput | undefined | void {
    const tags = card.tags.filter((tag) => tag === Tag.CRIME).length;
    player.addResourceTo(this, {qty: tags, log: true});
  }
}
