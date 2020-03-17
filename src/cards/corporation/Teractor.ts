
import { Tags } from "../Tags";
import { CorporationCard } from "./CorporationCard";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { IProjectCard } from "../IProjectCard";
import { CardName } from '../../CardName';

export class Teractor implements CorporationCard {
    public name: string = CardName.TERACTOR;
    public tags: Array<Tags> = [Tags.EARTH];
    public startingMegaCredits: number = 60;
    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.EARTH) !== -1) {
            return 3;
        }
        return 0;
    }
    public play() {
        return undefined;
    }
}
