import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { SpaceName } from "../../SpaceName";
import { SpaceType } from "../../SpaceType";
import { Resources } from '../../Resources';
import { IActionCard, ICard } from '../ICard';
import { ResourceType } from '../../ResourceType';
import { SelectCard } from '../../inputs/SelectCard';


export class Stratopolis implements IActionCard, IProjectCard {
    public cost: number = 22;
    public tags: Array<Tags> = [Tags.CITY, Tags.VENUS];
    public name: string = "Stratopolis";
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 2 ;
    }
    public play(player: Player, game: Game) {
        player.setProduction(Resources.MEGACREDITS,2);
        game.addCityTile(player, SpaceName.STRATOPOLIS, SpaceType.COLONY);
        return undefined;
    }
    public getVictoryPoints(player: Player): number {
        return Math.floor(player.getResourcesOnCard(this) / 3);
    }

    public getResCards(player: Player): ICard[] {
        let resourceCards = player.getResourceCards(ResourceType.FLOATER);
        resourceCards.filter(card => card.tags.filter((cardTag) => cardTag === Tags.VENUS));
        return resourceCards;
    }

    public canAct(): boolean {
        return true;
    } 

    public action(player: Player) {
        return new SelectCard(
            'Select card to add 2 floaters',
            this.getResCards(player),
            (foundCards: Array<ICard>) => {
              player.addResourceTo(foundCards[0], 2);
              return undefined;
            }
        );
    }    
}
