import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Game } from '../../Game';
import { ResourceType } from '../../ResourceType';
import { SelectCard } from '../../inputs/SelectCard';
import { ICard } from '../ICard';
import { SelectPlayer } from '../../inputs/SelectPlayer';
import { Resources } from '../../Resources';
import { AndOptions } from "../../inputs/AndOptions";


export class AirRaid implements IProjectCard {
    public cost: number = 0;
    public tags: Array<Tags> = [];
    public name: string = CardName.AIR_RAID;
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player): boolean {
        return player.getResourceCount(ResourceType.FLOATER) > 0;
    }

    public play(player: Player, game: Game) {
      
    let resourceCards: Array<ICard> = player.playedCards.filter(card => card.resourceType === ResourceType.FLOATER && player.getResourcesOnCard(card) > 0);
    if (player.corporationCard !== undefined && player.corporationCard.resourceType === ResourceType.FLOATER && player.getResourcesOnCard(player.corporationCard) > 0) {
        resourceCards.push(player.corporationCard);
    }
    const selectCard = new SelectCard(
        'Select card to remove one floater from ',
        resourceCards,
        (foundCards: Array<ICard>) => {
          player.removeResourceFrom(foundCards[0]);
          return undefined;
        }
      );

    const selectPlayer = new SelectPlayer(game.getPlayers().filter(selectedPlayer => selectedPlayer !== player), "Select player to steal up to 5 MC", (selectedPlayer: Player) => {
        player.megaCredits += Math.min(5, selectedPlayer.megaCredits);
        selectedPlayer.setResource(Resources.MEGACREDITS, -5, game, player);
        return undefined;
    });

    if (game.getPlayers().length === 1) {
        player.megaCredits += 5;
        return selectCard;
    }
    var options: Array<SelectPlayer | SelectCard<ICard>> = [];
    options.push(selectCard, selectPlayer);
    return new AndOptions(
        () => {return undefined;},
        ...options
    );
    }
}
