
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class VestaShipyard implements IProjectCard {
    public cost = 15;
    public tags = [Tags.JOVIAN, Tags.SPACE];
    public name = CardName.VESTA_SHIPYARD;
    public cardType = CardType.AUTOMATED;
    public getVictoryPoints(): number {
        return 1;
    }
    public play(player: Player, _game: Game): undefined {
        player.addProduction(Resources.TITANIUM);
        return undefined;
    }
}
