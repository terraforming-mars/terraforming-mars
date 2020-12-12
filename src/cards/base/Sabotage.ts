import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {OrOptions} from '../../inputs/OrOptions';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {SelectOption} from '../../inputs/SelectOption';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class Sabotage implements IProjectCard {
    public cost = 1;
    public tags = [];
    public cardType = CardType.EVENT;
    public name = CardName.SABOTAGE;

    public play(player: Player, game: Game) {
      if (game.isSoloMode()) return undefined;

      const availablePlayerTargets = game.getPlayers().filter((p) => p.id !== player.id);
      const availableActions = new OrOptions();

      availablePlayerTargets.forEach((target) => {
        if (target.titanium > 0) {
          const amountRemoved = Math.min(3, target.titanium);
          const optionTitle = 'Remove ' + amountRemoved + ' titanium from ' + target.name;

          availableActions.options.push(new SelectOption(optionTitle, 'Confirm', () => {
            target.setResource(Resources.TITANIUM, -3, game, player);
            return undefined;
          }));
        }

        if (target.steel > 0) {
          const amountRemoved = Math.min(4, target.steel);
          const optionTitle = 'Remove ' + amountRemoved + ' steel from ' + target.name;

          availableActions.options.push(new SelectOption(optionTitle, 'Confirm', () => {
            target.setResource(Resources.STEEL, -4, game, player);
            return undefined;
          }));
        }

        if (target.megaCredits > 0) {
          const amountRemoved = Math.min(7, target.megaCredits);
          const optionTitle = 'Remove ' + amountRemoved + ' MC from ' + target.name;

          availableActions.options.push(new SelectOption(optionTitle, 'Confirm', () => {
            target.setResource(Resources.MEGACREDITS, -7, game, player);
            return undefined;
          }));
        }
      });

      if (availableActions.options.length > 0) return availableActions;
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: '121',
      renderData: CardRenderer.builder((b) => {
        b.minus().titanium(3).digit.any.nbsp.or(CardRenderItemSize.SMALL).nbsp;
        b.minus().titanium(4).digit.any.br.or(CardRenderItemSize.SMALL).nbsp;
        b.minus().megacredits(7).any;
      }),
      description: 'Remove up to 3 titanium from any player, or 4 steel, or 7 MC.',
    }
}

