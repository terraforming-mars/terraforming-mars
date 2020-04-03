import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class PowerSupplyConsortium implements IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: CardName = CardName.POWER_SUPPLY_CONSORTIUM;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        const someoneHasEnergyProduction = game.getPlayers().filter(p => p.getProduction(Resources.ENERGY) > 0).length >= 1  ?  true : false; 
        return player.getTagCount(Tags.ENERGY) >= 2 && someoneHasEnergyProduction; 
    }
    public play(player: Player, game: Game) {
        game.addResourceProductionDecreaseInterrupt(player, Resources.ENERGY, 1);
        player.setProduction(Resources.ENERGY);
        return undefined;
    }
}