import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Resources } from "../../Resources";

export class OrbitalCleanup implements IProjectCard {
    public name = CardName.ORBITAL_CLEANUP;
    public cost = 14;
    public tags = [Tags.EARTH, Tags.SPACE];
    public cardType = CardType.ACTIVE;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.MEGACREDITS) >= -3;
    }

    public play(player: Player) {
        player.addProduction(Resources.MEGACREDITS, -2);
        return undefined;
    }

    public canAct(): boolean {
        return true;
    }

    public action(player: Player) {
        player.setResource(Resources.MEGACREDITS, player.getTagCount(Tags.SCIENCE))
        return undefined;
    }

    public getVictoryPoints() {
        return 2;
    }

}