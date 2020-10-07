import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "../prelude/PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { CardName } from '../../CardName';
import { Game } from "../../Game";
import { ColonyName } from "../../colonies/ColonyName";
import { SelectColony } from "../../inputs/SelectColony";
import { ColonyModel } from "../../models/ColonyModel";

export class AerospaceMission extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.AEROSPACE_MISSION;

    public play(player: Player, game: Game) {
        let openColonies = game.colonies.filter(colony => colony.isActive);
        let coloniesModel: Array<ColonyModel> = game.getColoniesModel(openColonies);

        game.interrupts.push({
            player: player,
            playerInput: new SelectColony("Select where to build colony", "Build", coloniesModel, (colonyName: ColonyName) => {
                openColonies.forEach(colony => {
                  if (colony.name === colonyName) {
                    colony.onColonyPlaced(player, game);
                    return undefined;
                  }

                  return undefined;
                });
                return undefined;
              })
        });

        player.fleetSize++;
        return undefined;
    }
}

