import { Player } from "../../Player";
import { IProjectCard } from "../IProjectCard";
import { CardType } from "../CardType";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { SelectOption } from "../../inputs/SelectOption";
import { OrOptions } from "../../inputs/OrOptions";

export class CrashSiteCleanup implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public name: CardName = CardName.CRASH_SITE_CLEANUP;

    public canPlay(player: Player) {
        return player.attackedPlayers.length > 0;
    }

    public play(player: Player) {
        const gainTitanium = new SelectOption(
            "Gain 1 titanium",
            () => {
              player.titanium++;
              return undefined;
            }
        );

        const gain2Steel = new SelectOption(
            "Gain 2 steel",
            () => {
              player.steel += 2;
              return undefined;
            }
        );

        return new OrOptions(gainTitanium, gain2Steel);
    }

    public getVictoryPoints() {
        return 1;
    }
}

