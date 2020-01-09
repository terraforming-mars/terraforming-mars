import { IProjectCard } from "../IProjectCard";
import {IActionCard} from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { SelectHowToPay } from '../../inputs/SelectHowToPay';
import { OrOptions } from '../../inputs/OrOptions';
import { SelectOption } from '../../inputs/SelectOption';
import { Game } from '../../Game';

export class ForcedPrecipitation implements IActionCard,IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.VENUS];
    public name: string = "Forced Precipitation";
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public canPlay(): boolean {
        return true;
    }
    public play() {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.canAfford(2) || player.getResourcesOnCard(this) > 1;
    }  
    
    public action(player: Player, game: Game) {
        if (player.getResourcesOnCard(this) < 2 &&  player.canAfford(2) ){
            if (player.canUseHeatAsMegaCredits && player.heat > 0) {
                return new SelectHowToPay(
                  'Select how to pay ', false, false,
                  true,
                  (htp) => {
                    if (htp.heat + htp.megaCredits < 2) {
                        throw new Error('Not enough spent to buy card');
                    }
                    player.megaCredits -= htp.megaCredits;
                    player.heat -= htp.heat;
                    player.addResourceTo(this);
                    return undefined;
                  },2
                );
            }
            player.megaCredits -= 2;
            player.addResourceTo(this);
            return undefined;
        }
        if (player.canAfford(2) && player.getResourcesOnCard(this) > 1) {
            return new OrOptions(
                new SelectOption("Add 1 floater to this card", () => {
                    if (player.canUseHeatAsMegaCredits && player.heat > 0) {
                        return new SelectHowToPay(
                        'Select how to pay ', false, false,
                        true,
                        (htp) => {
                            if (htp.heat + htp.megaCredits < 2) {
                                throw new Error('Not enough spent to buy card');
                            }
                            player.megaCredits -= htp.megaCredits;
                            player.heat -= htp.heat;
                            player.addResourceTo(this);
                            return undefined;
                        },2
                        );
                    }
                    player.megaCredits -= 2;
                    player.addResourceTo(this);
                    return undefined;
                }),
                new SelectOption("Remove 2 floaters to raise Venus 1 step", () => {
                    player.removeResourceFrom(this, 2);
                    game.increaseVenusScaleLevel(player,1);
                    return undefined;
                })
            );
        } 
        if (player.getResourcesOnCard(this) > 1) {
            player.removeResourceFrom(this, 2);
            game.increaseVenusScaleLevel(player,1);
            return undefined;
        }
        return undefined;
    }
}