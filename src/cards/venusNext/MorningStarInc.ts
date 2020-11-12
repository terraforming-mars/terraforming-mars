
import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';

export class MorningStarInc implements CorporationCard {
    public name = CardName.MORNING_STAR_INC;
    public tags = [Tags.VENUS];
    public startingMegaCredits: number = 50;
    public cardType = CardType.CORPORATION;

    public initialActionText: string = 'Draw 3 Venus-tag cards';
    public initialAction(player: Player, game: Game) {
      if (game.hasCardsWithTag(Tags.VENUS, 3)) {
        for (const foundCard of game.drawCardsByTag(Tags.VENUS, 3)) {
          player.cardsInHand.push(foundCard);
        }

        const drawnCards = game.getCardsInHandByTag(player, Tags.VENUS).slice(-3);

        game.log('${0} drew ${1}, ${2} and ${3}', (b) =>
          b.player(player).card(drawnCards[0]).card(drawnCards[1]).card(drawnCards[2]));
      }

      return undefined;
    }

    public getRequirementBonus(_player: Player, _game: Game, venusOnly?: boolean): number {
      if (venusOnly !== undefined && venusOnly) return 2;
      return 0;
    }

    public play() {
      return undefined;
    }
}
