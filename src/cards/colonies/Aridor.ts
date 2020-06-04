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
import { IColony } from '../../colonies/Colony';
import { LogMessageType } from "../../LogMessageType";
import { LogMessageData } from "../../LogMessageData";
import { LogMessageDataType } from "../../LogMessageDataType";

export class Aridor implements CorporationCard {
    public name: CardName =  CardName.ARIDOR;
    public tags: Array<Tags> = [];
    public startingMegaCredits: number = 40;
    public allTags = new Set();

    public initialAction(player: Player, game: Game) {
        if (game.colonyDealer === undefined || !game.coloniesExtension) return undefined;
        let addColony = new OrOptions();
        addColony.title = "Aridor first action - Select colony tile to add";
        game.colonyDealer.discardedColonies.forEach(colony => {
          const colonySelect =  new SelectOption(
            colony.name + " - (" + colony.description + ")", 
            () => {
                game.colonies.push(colony);
                game.colonies.sort((a,b) => (a.name > b.name) ? 1 : -1);
                
                game.log(
                    LogMessageType.DEFAULT,
                    "${0} added a new Colony tile: ${1}",
                    new LogMessageData(LogMessageDataType.PLAYER, player.id),
                    new LogMessageData(LogMessageDataType.STRING, colony.name)
                );

                this.checkActivation(colony, game);
                return undefined;
            }
          );
          addColony.options.push(colonySelect);
        });
        return addColony;
    }

    private checkActivation(colony: IColony, game: Game): void {
        if (colony.resourceType === undefined) return;
        game.getPlayers().forEach(player => {
            if (player.corporationCard !== undefined && player.corporationCard.resourceType === colony.resourceType) {
                colony.isActive = true;
                return;
            }
            let resourceCard = player.playedCards.find(card => card.resourceType === colony.resourceType);
                if (resourceCard !== undefined) {
                    colony.isActive = true;
                    return;
                }
            });
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
