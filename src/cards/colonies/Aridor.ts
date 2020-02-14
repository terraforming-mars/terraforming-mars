import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { CorporationName } from '../../CorporationName';
import { Game } from '../../Game';
import { SelectOption } from '../../inputs/SelectOption';
import { OrOptions } from '../../inputs/OrOptions';
import { IProjectCard } from '../IProjectCard';
import { Resources } from '../../Resources';
import { CardType } from '../CardType';

export class Aridor implements CorporationCard {
    public name: string =  CorporationName.ARIDOR;
    public tags: Array<Tags> = [];
    public startingMegaCredits: number = 40;

    public initialAction(_player: Player, game: Game) {
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
        if (card.cardType === CardType.EVENT || card.tags.length === 0) return undefined;

        let allTags = new Set();
        if (player.corporationCard !== undefined && player.corporationCard.tags.length > 0) {
          player.corporationCard.tags.forEach(tag => {
            allTags.add(tag);
          });
        }
        player.playedCards.filter((card) => card.cardType !== CardType.EVENT)
          .forEach(card => {
            card.tags.forEach(tag => {
              allTags.add(tag);
            });  
          }
        )

        for (const tag of card.tags) {
            let currentSize = allTags.size;
            allTags.add(tag);
            if (allTags.size > currentSize) {
                player.setProduction(Resources.MEGACREDITS);
            }
        }
        return undefined;
    }
    public play() {
        return undefined;
    }


}
