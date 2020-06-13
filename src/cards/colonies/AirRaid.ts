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
    public name: CardName = CardName.AIR_RAID;
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player): boolean {
        return player.getResourceCount(ResourceType.FLOATER) > 0;
    }

    public play(player: Player, game: Game) {
        let resourceCards = player.getCardsWithResources().filter(card => card.resourceType === ResourceType.FLOATER);

        const selectCard = new SelectCard(
            'Select card to remove one floater from ',
            resourceCards,
            (foundCards: Array<ICard>) => {
            player.removeResourceFrom(foundCards[0]);
            return undefined;
            }
        );

        if (game.soloMode) {
            player.megaCredits += 5;

            if (resourceCards.length === 1) {
                player.removeResourceFrom(resourceCards[0]);
                return undefined;
            } else {
                return selectCard;
            }
        }

        const eligiblePlayers = game.getPlayers().filter(selectedPlayer => selectedPlayer !== player);

        const selectPlayer = new SelectPlayer(eligiblePlayers, "Select player to steal up to 5 MC", (selectedPlayer: Player) => {
            player.megaCredits += Math.min(5, selectedPlayer.megaCredits);
            selectedPlayer.setResource(Resources.MEGACREDITS, -5, game, player);
            return undefined;
        });

        var options: Array<SelectPlayer | SelectCard<ICard>> = [];

        if (resourceCards.length === 1) {
            player.removeResourceFrom(resourceCards[0]);
        } else {
            options.push(selectCard);
        }

        if (eligiblePlayers.length > 1) {
            options.push(selectPlayer);
        } else {
            player.megaCredits += Math.min(5, eligiblePlayers[0].megaCredits);
            eligiblePlayers[0].setResource(Resources.MEGACREDITS, -5, game, player);
        }
        
        if (options.length > 0) {
            return new AndOptions(
                () => {return undefined;},
                ...options
            );
        } else {
            return undefined;
        }
    }
}
