import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {SelectOption} from '../../inputs/SelectOption';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class Sabotage extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.SABOTAGE,
      cost: 1,

      metadata: {
        cardNumber: '121',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(3).digit.any.nbsp.or(CardRenderItemSize.SMALL).nbsp;
          b.minus().steel(4).digit.any.br.or(CardRenderItemSize.SMALL).nbsp;
          b.minus().megacredits(7).any;
        }),
        description: 'Remove up to 3 titanium from any player, or 4 steel, or 7 MC.',
      },
    });
  }
  public play(player: Player) {
    if (player.game.isSoloMode()) return undefined;

    const availablePlayerTargets = player.game.getPlayers().filter((p) => p.id !== player.id);
    const availableActions = new OrOptions();

    availablePlayerTargets.forEach((target) => {
      if (target.titanium > 0 && !target.alloysAreProtected()) {
        const amountRemoved = Math.min(3, target.titanium);
        const optionTitle = 'Remove ' + amountRemoved + ' titanium from ' + target.name;

        availableActions.options.push(new SelectOption(optionTitle, 'Confirm', () => {
          target.setResource(Resources.TITANIUM, -3, player.game, player);
          return undefined;
        }));
      }

      if (target.steel > 0 && !target.alloysAreProtected()) {
        const amountRemoved = Math.min(4, target.steel);
        const optionTitle = 'Remove ' + amountRemoved + ' steel from ' + target.name;

        availableActions.options.push(new SelectOption(optionTitle, 'Confirm', () => {
          target.setResource(Resources.STEEL, -4, player.game, player);
          return undefined;
        }));
      }

      if (target.megaCredits > 0) {
        const amountRemoved = Math.min(7, target.megaCredits);
        const optionTitle = 'Remove ' + amountRemoved + ' MC from ' + target.name;

        availableActions.options.push(new SelectOption(optionTitle, 'Confirm', () => {
          target.setResource(Resources.MEGACREDITS, -7, player.game, player);
          return undefined;
        }));
      }
    });

    if (availableActions.options.length > 0) return availableActions;
    return undefined;
  }
}

