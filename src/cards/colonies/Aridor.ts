import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { Game } from '../../Game';
import { SelectOption } from '../../inputs/SelectOption';
import { OrOptions } from '../../inputs/OrOptions';
import { IProjectCard } from '../IProjectCard';
import { Resources } from '../../Resources';
import { CardType } from '../CardType';
import { CardName } from '../../CardName';

export class Aridor implements CorporationCard {
    public name: CardName =  CardName.ARIDOR;
    public tags: Array<Tags> = [];
    public startingMegaCredits: number = 40;
    public allTags = new Set();

    public initialAction(_player: Player, game: Game) {
        if (game.colonyDealer === undefined) return undefined;
        let addColony = new OrOptions();
        addColony.title = "Aridor first action - Select colony tile to add";
        game.colonyDealer.discardedColonies.forEach(colony => {
          const colonySelect =  new SelectOption(
            colony.name + " - (" + colony.description + ")", 
            () => {
                game.colonies.push(colony);
                game.colonies.sort((a,b) => (a.name > b.name) ? 1 : -1);
                return undefined;
            }
          );
          addColony.options.push(colonySelect);
        });
        return addColony;
    }
    
    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
        if (card.cardType === CardType.EVENT || card.tags.filter(tag => tag !== Tags.WILDCARD).length === 0 || !player.isCorporation(this.name)) return undefined;

        for (const tag of card.tags.filter(tag => tag !== Tags.WILDCARD)) {
            let currentSize = this.allTags.size;
            this.allTags.add(tag);
            if (this.allTags.size > currentSize) {
                player.setProduction(Resources.MEGACREDITS);
            }
        }
        return undefined;
    }
    public play() {
        return undefined;
    }


}
