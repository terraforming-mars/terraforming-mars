import {Tags} from '../../Tags';
import {Player} from '../../../Player';
import {PreludeCard} from '../../prelude/PreludeCard';
import {IProjectCard} from '../../IProjectCard';
import {CardName} from '../../../CardName';
import {Game} from '../../../Game';

export class VenusFirst extends PreludeCard implements IProjectCard {
    public tags = [Tags.VENUS];
    public name = CardName.VENUS_FIRST;

    public play(player: Player, game: Game) {
      game.increaseVenusScaleLevel(player, 2);

      if (game.hasCardsWithTag(Tags.VENUS, 2)) {
        for (const foundCard of game.drawCardsByTag(Tags.VENUS, 2)) {
          player.cardsInHand.push(foundCard);
        }

        const drawnCards = game.getCardsInHandByTag(player, Tags.VENUS).slice(-2);
        if (drawnCards.length > 1) {
          game.log('${0} drew ${1} and ${2}', (b) => b.player(player).card(drawnCards[0]).card(drawnCards[1]));
        }
      }

      return undefined;
    }
}

