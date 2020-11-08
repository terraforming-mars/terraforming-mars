import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from "../CardName";

export class EarthOffice implements IProjectCard {
    public cost = 1;
    public tags = [Tags.EARTH];
    public name = CardName.EARTH_OFFICE;
    public cardType = CardType.ACTIVE;

    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
      return card.tags.filter(tag => tag === Tags.EARTH).length * 3;
    }

    public play() {
      return undefined;
    }
}
