import { IProjectCard } from "../IProjectCard";
import {IActionCard} from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';
import { Resources } from "../../Resources";
import { MAX_VENUS_SCALE, REDS_RULING_POLICY_COST } from '../../constants';
import { CardName } from '../../CardName';
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";

export class VenusMagnetizer implements IActionCard,IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.VENUS];
    public name: CardName = CardName.VENUS_MAGNETIZER;
    public cardType: CardType = CardType.ACTIVE;
    
    public canPlay(player: Player, game: Game): boolean {
        return game.getVenusScaleLevel() >= 10 - (2 * player.getRequirementsBonus(game, true));
    }
    public play() {
        return undefined;
    }
    public canAct(player: Player, game: Game): boolean {
        const venusMaxed = game.getVenusScaleLevel() === MAX_VENUS_SCALE;
        const hasEnergyProduction = player.getProduction(Resources.ENERGY) > 0;

        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
            return player.canAfford(REDS_RULING_POLICY_COST) && hasEnergyProduction && !venusMaxed;
        }

        return hasEnergyProduction && !venusMaxed;
    }   
    public action(player: Player, game: Game) {
        player.setProduction(Resources.ENERGY,-1);
        game.increaseVenusScaleLevel(player,1);
        return undefined;
    }
}