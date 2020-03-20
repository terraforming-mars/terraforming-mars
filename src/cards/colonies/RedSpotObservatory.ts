import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { ResourceType } from '../../ResourceType';
import { SelectOption } from "../../inputs/SelectOption";
import { OrOptions } from "../../inputs/OrOptions";
import { Game } from '../../Game';

export class RedSpotObservatory implements IProjectCard {
    public cost: number = 17;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SCIENCE];
    public name: CardName = CardName.RED_SPOT_OBSERVATORY;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType = ResourceType.FLOATER;

    public canAct(): boolean {
        return true;
    }

    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 3;
    }

    public action(player: Player, game: Game) {
        var opts: Array<SelectOption> = [];
        const addResource = new SelectOption("Add 1 floater on this card", () => {
            player.addResourceTo(this, 1);
            return undefined;
        });

        const spendResource = new SelectOption("Remove 1 floater on this card to draw a card", () => {
            player.removeResourceFrom(this, 1);
            player.cardsInHand.push(game.dealer.dealCard());
            return undefined;
        });

        opts.push(addResource);

        if (player.getResourcesOnCard(this) > 0 ) {
            opts.push(spendResource);
        } else {
            return addResource;
        }

        return new OrOptions(...opts);
    }

    public play(player: Player, game: Game) {
        player.cardsInHand.push(game.dealer.dealCard());
        player.cardsInHand.push(game.dealer.dealCard());  
        return undefined;
    }

    public getVictoryPoints(): number {
        return 2;
    }
}