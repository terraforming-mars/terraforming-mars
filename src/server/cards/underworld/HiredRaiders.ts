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
import {UnderworldExpansion} from '../../../server/underworld/UnderworldExpansion';

export class HiredRaiders extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.HIRED_RAIDERS_UNDERWORLD,
      cost: 1,

      metadata: {
        cardNumber: 'U00',
        renderData: CardRenderer.builder((b) => {
          b.text('steal', Size.MEDIUM, true).megacredits(3, {all})
            .plus().megacredits(2, {all}).slash().corruption();
        }),
        description: 'Steal 3 M€, plus 2 extra M€ for each corruption resource you have, from any player.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const amount = 3 + (2 * player.underworldData.corruption);
    if (player.game.isSoloMode()) {
      player.megaCredits += amount;
      player.game.log('${0} stole ${1} M€ from the neutral player', (b) =>
        b.player(player).number(amount),
      );
    }

    const availablePlayerTargets = player.game.getPlayers().filter((p) => p.id !== player.id);
    const availableActions = new OrOptions();

    availablePlayerTargets.forEach((target) => {
      if (target.megaCredits > 0) {
        const amountStolen = Math.min(amount, target.megaCredits);
        const optionTitle = message('Steal ${0} M€ from ${1}', (b) => b.number(amountStolen).player(target));

        availableActions.options.push(new SelectOption(optionTitle).andThen(() => {
          return UnderworldExpansion.maybeBlockAttack(target, player, (proceed) => {
            if (proceed) {
              target.stock.steal(Resource.MEGACREDITS, amountStolen, player);
            }
            return undefined;
          });
        }));
      }
    });

    if (availableActions.options.length > 0) {
      availableActions.options.push(new SelectOption('Do not steal'));
      return availableActions;
    }
    return undefined;
  }
}
