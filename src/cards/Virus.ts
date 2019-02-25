
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { OrOptions } from "../inputs/OrOptions";
import { PlayerInput } from "../PlayerInput";

export class Virus implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: string = "Virus";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Remove up to 2 animals or 5 plants from any player.";
    public description: string = "The virus is transient, changing from liquid to air-borne to blood transfusion.";
    public play(player: Player, game: Game): PlayerInput | undefined {
        const allCardsWithResources: Array<IProjectCard> = [];
        game.getPlayers().forEach((o) => {
            if (o !== player) {
                o.getCardsWithResources().forEach((cardWithResource) => {
                    allCardsWithResources.push(cardWithResource);
                });
            }
        });
        return new OrOptions(
                    new SelectCard(this.name, "Select card to remove 2 animals", allCardsWithResources, (foundCard: Array<IProjectCard>) => {
                        if (foundCard[0].animals === undefined) {
                            throw "No animals on selected card";
                        }
                        foundCard[0].animals = Math.max(0, foundCard[0].animals - 2);
                        return undefined;
                    }),
                    new SelectPlayer(this.name, game.getPlayers(), "Select player to remove 5 plants", (foundPlayer: Player) => {
                        foundPlayer.plants = Math.max(0, foundPlayer.plants - 5);
                        return undefined;
                    })
                );
    }
}
