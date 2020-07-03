import {ICard} from './ICard';
import {IProjectCard} from './IProjectCard';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Tags} from './Tags';
import {SelectCard} from '../inputs/SelectCard';
import { CardName } from '../CardName';
import { Game } from '../Game';
import { LogHelper } from '../components/LogHelper';

export class CEOsFavoriteProject implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public name: CardName = CardName.CEOS_FAVORITE_PROJECT;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
      return player.getCardsWithResources().length > 0;
    }

    public play(player: Player, game: Game) {
      return new SelectCard(
          'Select card to add resource',
          player.getCardsWithResources(),
          (foundCards: Array<ICard>) => {
            player.addResourceTo(foundCards[0]);
            LogHelper.logAddResource(game, player, foundCards[0]);
            return undefined;
          }
      );
    }
}

