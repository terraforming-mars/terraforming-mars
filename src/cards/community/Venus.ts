import { Colony, IColony } from '../../colonies/Colony';
import { Player } from '../../Player';
import { Game } from '../../Game';
import { ColonyName } from '../../colonies/ColonyName';
import { ResourceType } from '../../ResourceType';
import { ICard } from '../ICard';
import { Tags } from '../Tags';
import { LogHelper } from '../../components/LogHelper';
import { SelectCard } from '../../inputs/SelectCard';
import { CorroderSuits } from '../venusNext/CorroderSuits';

export class Venus extends Colony implements IColony {
    public name = ColonyName.VENUS;
    public isActive = false;
    public description: string = "Venus";

    public trade(player: Player, game: Game, usesTradeFleet: boolean = true): void {
        if (usesTradeFleet) this.beforeTrade(this, player, game);

        let qty : number = 0;
        
        if (this.trackPosition >= 3) qty = this.trackPosition - 2;
        if (qty > 0) this.addVenusResourceCardInterrupt(player, game, qty);

        if (usesTradeFleet) this.afterTrade(this, player, game);
    }

    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player, game);
        game.increaseVenusScaleLevel(player, 1);
        return undefined;
    }
    
    public giveTradeBonus(player: Player, game: Game): void {
        this.addVenusResourceCardInterrupt(player, game);
    }   

    private getResCards(player: Player): ICard[] {
        let resourceCards = player.getResourceCards(ResourceType.FLOATER);
        resourceCards = resourceCards.concat(player.getResourceCards(ResourceType.MICROBE));
        resourceCards = resourceCards.concat(player.getResourceCards(ResourceType.ANIMAL));
        return resourceCards.filter(card => card.tags.indexOf(Tags.VENUS) !== -1);
    }

    private addVenusResourceCardInterrupt(player: Player, game: Game, qty: number = 1) : void {
        const targetCards = CorroderSuits.getVenusResCards(player);

        if (targetCards.length === 1) {
            player.addResourceTo(targetCards[0], 1);
            LogHelper.logAddResource(game, player, targetCards[0]);
        } else if (targetCards.length > 1) {
            game.interrupts.push({
                player: player,
                playerInput: new SelectCard(
                    "Select Venus card to add 1 resource",
                    "Add resource",
                    this.getResCards(player),
                    (foundCards: Array<ICard>) => {
                        player.addResourceTo(foundCards[0], qty);
                        LogHelper.logAddResource(game, player, foundCards[0]);
                        return undefined;
                    }
                )
            });
        }
    }
}