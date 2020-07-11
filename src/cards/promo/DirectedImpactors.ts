import { IProjectCard } from '../IProjectCard';
import { IActionCard, IResourceCard, ICard } from '../ICard';
import { CardName } from '../../CardName';
import { CardType } from '../CardType';
import { ResourceType } from '../../ResourceType';
import { Tags } from '../Tags';
import { Player } from '../../Player';
import { SelectCard } from '../../inputs/SelectCard';
import { Game } from '../../Game';
import { SelectOption } from '../../inputs/SelectOption';
import { OrOptions } from '../../inputs/OrOptions';
import { MAX_TEMPERATURE } from '../../constants';
import { LogHelper } from '../../components/LogHelper';

export class DirectedImpactors implements IActionCard, IProjectCard, IResourceCard {
    public name: CardName = CardName.DIRECTED_IMPACTORS;
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.SPACE];
    public resourceType: ResourceType = ResourceType.ASTEROID;
    public resourceCount: number = 0;
    public cardType: CardType = CardType.ACTIVE;

    public canPlay(): boolean {
        return true;
    }

    public play() {
        return undefined;
    }

    public canAct(player: Player, game: Game): boolean {
        const canRaiseTemperature = this.resourceCount > 0 && game.getTemperature() < MAX_TEMPERATURE;
        return player.canAfford(6, game, false, true) || canRaiseTemperature;
    }

    public action(player: Player, game: Game) {
        const asteroidCards = player.getResourceCards(ResourceType.ASTEROID);
        var opts: Array<SelectOption> = [];

        const addResource = new SelectOption("Pay 6 to add 1 asteroid to a card", () => this.addResource(player, game, asteroidCards));
        const spendResource = new SelectOption("Remove 1 asteroid to raise temperature 1 step", () => this.spendResource(player, game));

        if (this.resourceCount > 0 && game.getTemperature() < MAX_TEMPERATURE) {
            opts.push(spendResource);
        } else {
            return this.addResource(player, game, asteroidCards);
        }

        if (player.canAfford(6, game, false, true)) {
            opts.push(addResource);
        } else {
            return this.spendResource(player, game);
        }
        
        return new OrOptions(...opts);
    }

    private addResource(player: Player, game: Game, asteroidCards: ICard[]) {
        game.addSelectHowToPayInterrupt(player, 6, false, true, "Select how to pay for Directed Impactors action");

        if (asteroidCards.length === 1) {
            player.addResourceTo(this);
            LogHelper.logAddResource(game, player, this);
            return undefined;
        }

        return new SelectCard(
            "Select card to add 1 asteroid", 
            asteroidCards, 
            (foundCards: Array<ICard>) => { 
                player.addResourceTo(foundCards[0]);
                LogHelper.logAddResource(game, player, foundCards[0]);
                return undefined;
            }
        );
    }

    private spendResource(player: Player, game: Game) {
        this.resourceCount--;
        LogHelper.logRemoveResource(game, player, this, 1, "raise temperature 1 step");
        game.increaseTemperature(player, 1);
        return undefined;
    }
}