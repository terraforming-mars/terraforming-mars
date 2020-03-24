import { IProjectCard } from "../IProjectCard";
import { IActionCard, ICard, IResourceCard } from '../ICard';
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { ResourceType } from "../../ResourceType";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from "../../inputs/SelectOption";
import { SelectCard } from '../../inputs/SelectCard';
import { CardName } from '../../CardName';

export class AerialMappers implements IActionCard,IProjectCard, IResourceCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.VENUS];
    public name: CardName = CardName.AERIAL_MAPPERS;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public play() {
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }     
    public getVictoryPoints() {
        return 1;
    }       
    public action(player: Player, game: Game) {
        const floaterCards = player.getResourceCards(ResourceType.FLOATER);
        var opts: Array<SelectOption | SelectCard<ICard>> = [];
        const addResource = new SelectCard(
            'Select card to add 1 floater',
            floaterCards,
            (foundCards: Array<ICard>) => {
              player.addResourceTo(foundCards[0], 1);
              return undefined;
            }
        );

        const spendResource = new SelectOption("Remove 1 floater on this card and draw a card", () => {
            this.resourceCount--;
            player.cardsInHand.push(game.dealer.dealCard());
            return undefined;
        });

        opts.push(addResource);

        if (this.resourceCount > 0) {
             opts.push(spendResource);
        } else return addResource;

        return new OrOptions(...opts);
    }
}