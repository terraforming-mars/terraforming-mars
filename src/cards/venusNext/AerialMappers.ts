import { IProjectCard } from "../IProjectCard";
import {IActionCard} from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { ResourceType } from "../../ResourceType";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from "../../inputs/SelectOption";
import { SelectCard } from '../../inputs/SelectCard';

export class AerialMappers implements IActionCard,IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.VENUS];
    public name: string = "Aerial Mappers";
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public canPlay(): boolean {
        return true;
    }
    public play() {
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }     
    public getVictoryPoints() {
        return 1;
    }       
    public action(player: Player, game: Game) {
        const floaterCards = player.getResourceCards(ResourceType.FLOATER);
        if (player.getResourcesOnCard(this) < 1 && floaterCards.length === 1) {
            player.addResourceTo(this);
            return undefined;
        }

        if (player.getResourcesOnCard(this) < 1) {
            return new SelectCard(
                'Select card to add 1 floater',
                floaterCards,
                (foundCards: Array<IProjectCard>) => {
                  player.addResourceTo(foundCards[0], 1);
                  return undefined;
                }
            )
        } 

        return new OrOptions(
            new SelectCard(
                'Select card to add 1 floater',
                floaterCards,
                (foundCards: Array<IProjectCard>) => {
                  player.addResourceTo(foundCards[0], 1);
                  return undefined;
                }
            ),   
            new SelectOption("Remove 1 floater on this card and draw a card", () => {
                player.removeResourceFrom(this, 1);
                player.cardsInHand.push(game.dealer.dealCard());
                return undefined;
            })
        );
    }
}