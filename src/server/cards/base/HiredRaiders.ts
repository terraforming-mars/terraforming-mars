import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';
import {message} from '../../logs/MessageBuilder';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';

export class HiredRaiders extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.HIRED_RAIDERS,
      cost: 1,

      metadata: {
        cardNumber: '124',
        renderData: CardRenderer.builder((b) => {
          b.text('steal', Size.MEDIUM, true).steel(2, {all}).br;
          b.or().br;
          b.text('steal', Size.MEDIUM, true).megacredits(3, {all});
        }),
        description: 'Steal up to 2 steel, or 3 M€ from any player.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    if (player.game.isSoloMode()) {
      return new OrOptions(
        new SelectOption('Steal 2 steel', 'Steal steel').andThen(() => {
          player.steel += 2;
          return undefined;
        }),
        new SelectOption('Steal 3 M€', 'Steal M€').andThen(() => {
          player.megaCredits += 3;
          return undefined;
        }),
      );
    }

    const availablePlayerTargets = player.game.getPlayers().filter((p) => p.id !== player.id);
    const availableActions = new OrOptions();

    availablePlayerTargets.forEach((target) => {
      if (target.steel > 0 && !target.alloysAreProtected()) {
        const amountStolen = Math.min(2, target.steel);
        const optionTitle = message('Steal ${0} steel from ${1}', (b) => b.number(amountStolen).player(target).getMessage());

        availableActions.options.push(new SelectOption(optionTitle).andThen(() => {
          target.defer(UnderworldExpansion.maybeBlockAttack(target, player, (proceed) => {
            if (proceed) {
              target.stock.deduct(Resource.STEEL, 2, {log: true, from: player, stealing: true});
              player.steel += amountStolen;
            }
            return undefined;
          }));
          return undefined;
        }));
      }

      if (target.megaCredits > 0) {
        const amountStolen = Math.min(3, target.megaCredits);
        const optionTitle = message('Steal ${0} M€ from ${1}', (b) => b.number(amountStolen).player(target));

        availableActions.options.push(new SelectOption(optionTitle).andThen(() => {
          target.defer(UnderworldExpansion.maybeBlockAttack(target, player, (proceed) => {
            if (proceed) {
              player.megaCredits += amountStolen;
              target.stock.deduct(Resource.MEGACREDITS, 3, {log: true, from: player, stealing: true});
            }
            return undefined;
          }));
          return undefined;
        }));
      }
    });

    if (availableActions.options.length > 0) {
      availableActions.options.push(new SelectOption('Do not steal').andThen(() => {
        return undefined;
      }));
      return availableActions;
    }
    return undefined;
  }
}

