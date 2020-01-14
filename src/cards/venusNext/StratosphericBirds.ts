import { IProjectCard } from "../IProjectCard";
import {IActionCard} from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { Game } from '../../Game';
import { SelectCard } from "../../inputs/SelectCard";

export class StratosphericBirds implements IActionCard,IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.VENUS, Tags.ANIMAL];
    public name: string = "Stratospheric Birds";
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public canPlay(player: Player, game: Game): boolean {
        const cardsWithFloater = player.getCardsWithResources().filter(card => card.resourceType === ResourceType.FLOATER);
        if (cardsWithFloater.length === 0) return false;
        return game.getVenusScaleLevel() >= 12 - (2 * player.getRequirementsBonus(game, true));
    }
    public play(player: Player) {
       const cardsWithFloater = player.getCardsWithResources().filter(card => card.resourceType === ResourceType.FLOATER);
        if (cardsWithFloater.length === 1) {
            player.removeResourceFrom(cardsWithFloater[0], 1)
            return undefined;
        }
        return new SelectCard(
            "Select card to remove 1 floater from", 
            cardsWithFloater,
            (foundCards) => {
                player.removeResourceFrom(foundCards[0], 1)
                return undefined;
            }
        );
    }
    public canAct(): boolean {
        return true;
    }   
    public getVictoryPoints(player: Player): number {
        return player.getResourcesOnCard(this);
    }
    public action(player: Player) {
        player.addResourceTo(this);
        return undefined;
    }
}