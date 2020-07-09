import { Player } from "../../Player";
import { IProjectCard } from "../IProjectCard";
import { CardType } from "../CardType";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { SelectOption } from "../../inputs/SelectOption";
import { OrOptions } from "../../inputs/OrOptions";
import { Game } from "../../Game";
import { LogHelper } from "../../components/LogHelper";
import { Resources } from "../../Resources";

export class CrashSiteCleanup implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public name: CardName = CardName.CRASH_SITE_CLEANUP;

    public canPlay(_player: Player, game: Game) {
        return game.someoneHasRemovedOtherPlayersPlants;
    }

    public play(player: Player, game: Game) {
        const gainTitanium = new SelectOption(
            "Gain 1 titanium",
            () => {
              player.titanium++;
              LogHelper.logGainStandardResource(game, player, Resources.TITANIUM);
              return undefined;
            }
        );

        const gain2Steel = new SelectOption(
            "Gain 2 steel",
            () => {
              player.steel += 2;
              LogHelper.logGainStandardResource(game, player, Resources.STEEL, 2);
              return undefined;
            }
        );

        return new OrOptions(gainTitanium, gain2Steel);
    }

    public getVictoryPoints() {
        return 1;
    }
}

