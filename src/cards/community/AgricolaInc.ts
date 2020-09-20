import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';
import { ITagCount } from "../../ITagCount";
import { Game } from "../../Game";

export class AgricolaInc implements CorporationCard {
    public name: CardName =  CardName.AGRICOLA_INC;
    public tags: Array<Tags> = [Tags.PLANT];
    public startingMegaCredits: number = 40;

    public play(player: Player) {
        player.setProduction(Resources.MEGACREDITS, 1);
        player.setProduction(Resources.PLANTS, 1);

        return undefined;
    }

    public getVictoryPoints(player: Player, game: Game): number {
        let scorableTags : Array<Tags> = [Tags.CITY, Tags.EARTH, Tags.ENERGY, Tags.JOVIAN, Tags.MICROBES, Tags.PLANT, Tags.SCIENCE, Tags.SPACE, Tags.STEEL, Tags.ANIMAL, Tags.EVENT];
        if (game.gameOptions.venusNextExtension) scorableTags.push(Tags.VENUS);

        const playerTags : ITagCount[] = player.getAllTags();
        let points = 0;

        scorableTags.forEach((tag) => {
            const tagData = playerTags.find((data) => data.tag === tag);

            if (tagData === undefined) {
                points -= 2;
            } else if (tagData.count === 3 || tagData.count === 4) {
                points += 1;
            } else if (tagData.count > 4) {
                points += 2;
            }
        });

        return points;
    }
}
