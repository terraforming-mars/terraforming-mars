import { IProjectCard } from "../IProjectCard";
import {IActionCard} from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { Game } from '../../Game';

export class StratosphericBirds implements IActionCard,IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.VENUS, Tags.ANIMAL];
    public name: string = "Stratospheric Birds";
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public canPlay(player: Player, game: Game): boolean {
        return game.getVenusScaleLevel() >= 12 - (2 * player.getRequirementsBonus(game, true));
    }
    public play() {
        return undefined;
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