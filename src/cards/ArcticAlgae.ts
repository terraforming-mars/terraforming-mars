import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { ISpace } from "../ISpace";
import { TileType } from "../TileType";
import { CardName } from "../CardName";
import { CardMetadata } from "./CardMetadata";
import { CardRow } from "./CardRow";
import { CardBonus } from "./CardBonus";
import { CardEffect } from "./CauseAndEffect";
import { CardRequirement } from "./CardRequirement";
import { CardRequirements } from "./CardRequirements";

export class ArcticAlgae implements IProjectCard {
    public cost = 12;
    public tags = [Tags.PLANT];
    public name = CardName.ARCTIC_ALGAE;
    public cardType = CardType.ACTIVE;
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() <= -12 + player.getRequirementsBonus(game) * 2;
    }
    public onTilePlaced(player: Player, space: ISpace) {
        if (space.tile !== undefined && space.tile.tileType === TileType.OCEAN) {
            player.plants += 2;
        }
    }
    public play(player: Player) {
        player.plants++;
        return undefined;
    }
    public metadata: CardMetadata = {
        description: "It must be -12 C or colder to play. Gain 1 Plant.",
        cardNumber: "023",
        requirements: new CardRequirements([CardRequirement.temperature(-12).max()]),
        onPlay: [
            CardRow.add([
                CardEffect.add(
                    [CardBonus.oceans(1).any()],
                    [CardBonus.plants(2)],
                    "When anyone places an ocean tile, gain 2 Plants"
                ),
            ]),
            CardRow.add([CardBonus.plants(1)]),
        ],
    };
}
