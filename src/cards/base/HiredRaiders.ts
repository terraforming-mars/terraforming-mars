import {Card} from '../Card';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../common/cards/CardType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../common/cards/render/Size';
import {all} from '../Options';

export class HiredRaiders extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
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

  public play(player: Player) {
    if (player.game.isSoloMode()) {
      return new OrOptions(
        new SelectOption('Steal 2 steel', 'Steal steel', () => {
          player.steel += 2;
          return undefined;
        }),
        new SelectOption('Steal 3 M€', 'Steal M€', () => {
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
          target.deductResource(Resources.STEEL, 2, {log: true, from: player, stealing: true});
          return undefined;
        }));
      }

      if (target.megaCredits > 0) {
        const amountStolen = Math.min(3, target.megaCredits);
        const optionTitle = 'Steal ' + amountStolen + ' M€ from ' + target.name;

        availableActions.options.push(new SelectOption(optionTitle, 'Confirm', () => {
          player.megaCredits += amountStolen;
          target.deductResource(Resources.MEGACREDITS, 3, {log: true, from: player, stealing: true});
          return undefined;
        }));
      }
    });

    if (availableActions.options.length > 0) {
      availableActions.options.push(new SelectOption('Do not steal', 'Confirm', () => {
        return undefined;
      }));
      return availableActions;
    }
    return undefined;
  }
}

