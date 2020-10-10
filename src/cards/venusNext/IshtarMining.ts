import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { Resources } from "../../Resources";
import { CardName } from '../../CardName';

export class IshtarMining implements IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [Tags.VENUS];
    public name: CardName = CardName.ISHTAR_MINING;
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return game.getVenusScaleLevel() >= 8 - (2 * player.getRequirementsBonus(game, true));
    }
    public play(player: Player) {
        player.addProduction(Resources.TITANIUM);
        return undefined;
    }
}