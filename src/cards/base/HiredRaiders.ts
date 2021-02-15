import {Card} from '../Card';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class HiredRaiders extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.HIRED_RAIDERS,
      cost: 1,

      metadata: {
        cardNumber: '124',
        renderData: CardRenderer.builder((b) => {
          b.text('steal', CardRenderItemSize.MEDIUM, true).steel(2).any.br;
          b.or().br;
          b.text('steal', CardRenderItemSize.MEDIUM, true).megacredits(3).any;
        }),
        description: 'Steal up to 2 steel, or 3 MC from any player.',
      },
    });
  }

  public play(player: Player) {
    if (player.game.isSoloMode()) {
      return new OrOptions(
        new SelectOption('Steal 2 steel', 'Steal steel', () => {
          player.steel += 2;
          return undefined;
        }),
        new SelectOption('Steal 3 mega credit', 'Steal MC', () => {
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
        const optionTitle = 'Steal ' + amountStolen + ' steel from ' + target.name;

        availableActions.options.push(new SelectOption(optionTitle, 'Confirm', () => {
          player.steel += amountStolen;
          target.setResource(Resources.STEEL, -2, player.game, player);
          return undefined;
        }));
      }

      if (target.megaCredits > 0) {
        const amountStolen = Math.min(3, target.megaCredits);
        const optionTitle = 'Steal ' + amountStolen + ' MC from ' + target.name;

        availableActions.options.push(new SelectOption(optionTitle, 'Confirm', () => {
          player.megaCredits += amountStolen;
          target.setResource(Resources.MEGACREDITS, -3, player.game, player);
          return undefined;
        }));
      }
    });

    if (availableActions.options.length > 0) return availableActions;
    return undefined;
  }
}

