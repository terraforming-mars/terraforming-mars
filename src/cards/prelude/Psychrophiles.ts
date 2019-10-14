import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";

export class Psychrophiles implements IProjectCard {
    public cost: number = 2;
    public resourceType: ResourceType = ResourceType.MICROBE;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: string = "Psychrophiles";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Add 1 microbe to this card";
    public text: string = "Effect: When paying for a plant card, microbes here may be used as 2 MC each. Temperature must be -20 C or lower";
    public description: string = "";
    public canPlay(): boolean {
	    return game.getTemperature() <= -20 + (player.getRequirementsBonus(game) * 2);
    }
	    
    public play(player: Player) {
		player.canUseMicrobesAsMegaCreditsForPlants = true;
        return undefined;
    }
	
    public action(player: Player) {
        player.addResourceTo(this);
        return undefined;
    }
}