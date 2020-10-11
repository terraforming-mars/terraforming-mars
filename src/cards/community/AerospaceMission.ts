import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "../prelude/PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from "../../inputs/SelectOption";

export class AerospaceMission extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.AEROSPACE_MISSION;

    public canPlay(player: Player, _game: Game, bonusMc?: number) {
      const requiredPayment = 14 - (bonusMc || 0);
      
      if (requiredPayment <= 0) return true;
      return player.canAfford(requiredPayment);
    }

    public play(player: Player, game: Game) {
        const openColonies = game.colonies.filter((colony) => colony.isActive);
        const selectColonies = new OrOptions();
        selectColonies.title = "Select colonies to build";

        openColonies.forEach(function (c1) {
            openColonies.slice(1).forEach(function (c2) {
                if (c1.name !== c2.name) {
                    const description =
                        "Build colonies on " +
                        c1.name +
                        " (" +
                        c1.description +
                        ") and " +
                        c2.name +
                        " (" +
                        c2.description +
                        ")";

                    const colonySelect = new SelectOption(
                        description,
                        "Select",
                        () => {
                            c1.onColonyPlaced(player, game);
                            c2.onColonyPlaced(player, game);
                            return undefined;
                        }
                    );

                    selectColonies.options.push(colonySelect);
                }
            });
        });

        game.interrupts.push({
            player: player,
            playerInput: selectColonies,
        });

        player.megaCredits -= 14;
        return undefined;
    }
}
