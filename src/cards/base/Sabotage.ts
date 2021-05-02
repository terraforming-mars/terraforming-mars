import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {SelectOption} from '../../inputs/SelectOption';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';

export class Sabotage extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.SABOTAGE,
      cost: 1,

      metadata: {
        cardNumber: '121',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(3).digit.any.nbsp.or(Size.SMALL).nbsp;
          b.minus().steel(4).digit.any.br.or(Size.SMALL).nbsp;
          b.minus().megacredits(7).any;
        }),
        description: 'Remove up to 3 titanium from any player, or 4 steel, or 7 M€.',
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
          target.addResource(Resources.TITANIUM, -3, {log: true, from: player});
          return undefined;
        }));
      }

      if (target.steel > 0 && !target.alloysAreProtected()) {
        const amountRemoved = Math.min(4, target.steel);
        const optionTitle = 'Remove ' + amountRemoved + ' steel from ' + target.name;

        availableActions.options.push(new SelectOption(optionTitle, 'Confirm', () => {
          target.addResource(Resources.STEEL, -4, {log: true, from: player});
          return undefined;
        }));
      }

      if (target.megaCredits > 0) {
        const amountRemoved = Math.min(7, target.megaCredits);
        const optionTitle = 'Remove ' + amountRemoved + ' M€ from ' + target.name;

        availableActions.options.push(new SelectOption(optionTitle, 'Confirm', () => {
          target.addResource(Resources.MEGACREDITS, -7, {log: true, from: player});
          return undefined;
        }));
      }
    });

    if (availableActions.options.length > 0) {
      availableActions.options.push(new SelectOption('Do not remove resource', 'Confirm', () => {
        return undefined;
      }));
      return availableActions;
    }
    return undefined;
  }
}

