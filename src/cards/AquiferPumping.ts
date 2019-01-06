
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { IUserData } from "../IUserData";

export class AquiferPumping implements IActiveProjectCard {
    public cost: 18;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Aquifer Pumping";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "Action: Spend 8 mega credits to place 1 ocean tile. STEEL MAY BE USED as if you were playing a building card.";
    public description: string = "Underground water reservoirs may be tapped in a controlled manner, to safely build up oceans to the desired level";
    public play(player: Player, game: Game): void {
        // Nothing happens when played
    }
    public needsUserData: IUserData = {
        spaceId: "Where to place ocean tile",
        steel: "Steel to spend",
        megaCredits: "Mega credits to spend"
    }
    public action(player: Player, game: Game, userData: IUserData): void {
        if(parseInt(userData.steel) > player.steel) {
            throw "Not enough steel";
        }
        if (parseInt(userData.megaCredits) > player.megaCredits) {
            throw "Not enough mega credits";
        }
        if ((parseInt(userData.steel) * 2) + parseInt(userData.megaCredits) < 8) {
            throw "Need to spend 8";
        }
        game.addOceanTile(player, userData.spaceId);
        player.steel -= parseInt(userData.steel);
        player.megaCredits -= parseInt(userData.megaCredits);
    }
}

