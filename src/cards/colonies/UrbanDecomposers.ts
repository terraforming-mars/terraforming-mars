import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { Resources } from "../../Resources";
import { Game } from "../../Game";
import { ResourceType } from "../../ResourceType";
import { AddResourcesToCard } from "../../deferredActions/AddResourcesToCard";

export class UrbanDecomposers implements IProjectCard {
    public cost = 6;
    public tags = [Tags.MICROBES];
    public name = CardName.URBAN_DECOMPOSERS;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        let coloniesCount: number = 0;
        game.colonies.forEach(colony => { 
            coloniesCount += colony.colonies.filter(owner => owner === player.id).length;
        });
        return coloniesCount > 0 && player.getCitiesCount(game) > 0;
    }

    public play(player: Player, game: Game) {
        player.addProduction(Resources.PLANTS, 1);

        const microbeCards = player.getResourceCards(ResourceType.MICROBE);
        if (microbeCards.length) {
            game.defer(new AddResourcesToCard(player, game, ResourceType.MICROBE, 2));
        }

        return undefined;
    }
}
