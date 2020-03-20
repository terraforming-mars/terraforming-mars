
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CorporationCard } from "./CorporationCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class SaturnSystems implements CorporationCard {
    public name: CardName = CardName.SATURN_SYSTEMS;
    public tags: Array<Tags> = [Tags.JOVIAN];
    public startingMegaCredits: number = 42; 
    public onCardPlayed(_player: Player, game: Game, card: IProjectCard) {
        for (const tag of card.tags) {
            if (tag === Tags.JOVIAN) {
                game.getCardPlayer(this.name).setProduction(Resources.MEGACREDITS);
            }
        }
    }
    public play(player: Player) {
        player.setProduction(Resources.TITANIUM);
        player.setProduction(Resources.MEGACREDITS);
        return undefined;
    }
}
