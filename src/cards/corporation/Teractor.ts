import { Tags } from "../Tags";
import { CorporationCard } from "./CorporationCard";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";

export class Teractor implements CorporationCard {
    public name = CardName.TERACTOR;
    public tags = [Tags.EARTH];
    public startingMegaCredits: number = 60;
    public cardType = CardType.CORPORATION;

    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        return card.tags.filter(tag => tag === Tags.EARTH).length * 3;
    }
    public play() {
        return undefined;
    }
}
