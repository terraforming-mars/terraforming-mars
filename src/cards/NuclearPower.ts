
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class NuclearPower implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public name: CardName = CardName.NUCLEAR_POWER;
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.MEGACREDITS) >= -3;
    }
    public play(player: Player, _game: Game) {
        if (player.getProduction(Resources.MEGACREDITS) < -3) {
            throw "Not enough mega credit production";
        }
        player.addProduction(Resources.MEGACREDITS,-2);
        player.addProduction(Resources.ENERGY,3);
        return undefined;
    }
}
