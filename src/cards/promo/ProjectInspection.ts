import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {Playwrights} from '../community/Playwrights';
import {ICard} from '../ICard';
import {SelectCard} from '../../inputs/SelectCard';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class ProjectInspection implements IProjectCard {
    public name = CardName.PROJECT_INSPECTION;
    public cost = 0;
    public tags = [];
    public cardType = CardType.EVENT;
    private getActionCards(player: Player, game: Game): Array<ICard> {
      const result: Array<ICard> = [];

      if (player.corporationCard !== undefined && player.getActionsThisGeneration().has(player.corporationCard.name)) {
        if (player.corporationCard.name !== CardName.PLAYWRIGHTS || (player.corporationCard as Playwrights).getCheckLoops() < 2) {
          if (player.corporationCard.action !== undefined &&
              player.corporationCard.canAct !== undefined &&
              player.corporationCard.canAct(player, game)) {
            result.push(player.corporationCard);
          }
        }
      }

      for (const playedCard of player.playedCards) {
        if (playedCard.action !== undefined && playedCard.canAct !== undefined && playedCard.canAct(player, game) && player.getActionsThisGeneration().has(playedCard.name)) {
          result.push(playedCard);
        }
      }
      return result;
    }

    public canPlay(player: Player, game: Game): boolean {
      return this.getActionCards(player, game).length > 0;
    }

    public play(player: Player, game: Game) {
      const actionCards = this.getActionCards(player, game);
      if (actionCards.length === 0 ) {
        return undefined;
      }
      return new SelectCard(
        'Perform an action from a played card again',
        'Take action',
        actionCards,
        (foundCards: Array<ICard>) => {
          const foundCard = foundCards[0];
          game.log('${0} used ${1} action with ${2}', (b) => b.player(player).card(foundCard).card(this));
          return foundCard.action!(player, game);
        },
      );
    }
    public metadata: CardMetadata = {
      cardNumber: 'X02',
      renderData: CardRenderer.builder((b) => {
        b.text('Use a card action that has been used this generation.', CardRenderItemSize.SMALL, true);
      }),
    }
}
