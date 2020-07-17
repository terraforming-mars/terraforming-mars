import { IProjectCard } from '../IProjectCard';
import { CardName } from '../../CardName';
import { CardType } from '../CardType';
import { Tags } from '../Tags';
import { Player } from '../../Player';
import { SelectCard } from '../../inputs/SelectCard';
import { Game } from '../../Game';
import { LogMessageType } from '../../LogMessageType';
import { LogMessageData } from '../../LogMessageData';
import { LogMessageDataType } from '../../LogMessageDataType';
import { OrOptions } from "../../inputs/OrOptions";

export interface RobotCard {
    card: IProjectCard;
    resourceCount: number;
}

export class SelfReplicatingRobots implements IProjectCard {

    public name: CardName = CardName.SELF_REPLICATING_ROBOTS;
    public cost: number = 7;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.ACTIVE;
    public targetCards: Array<RobotCard> = [];

    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard): number {
        for (let targetCard of this.targetCards) {
            if (targetCard.card.name === card.name) {
                return targetCard.resourceCount;
            }
        }    
        return 0;
    }    

    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 2;
    }

    public play() {
        return undefined;
    }

    public canAct(player: Player): boolean {
        if (this.targetCards.length > 0) 
          return true;
        if (player.cardsInHand.filter(card => card.tags.filter(tag => tag === Tags.SPACE || tag === Tags.STEEL).length > 0).length > 0)
          return true;
        return false;
    }

    public action(player: Player, game: Game) {

        let orOptions = new OrOptions();
        const selectableCards = player.cardsInHand.filter(card => card.tags.filter(tag => tag === Tags.SPACE || tag === Tags.STEEL).length > 0);

        if (selectableCards.length > 0) {
            orOptions.options.push(new SelectCard(
                'Select card to link with Self-Replicating Robots', selectableCards,
                (foundCards: Array<IProjectCard>) => {
                  const projectCardIndex = player.cardsInHand.findIndex((card) => card.name === foundCards[0].name);
                  player.cardsInHand.splice(projectCardIndex, 1);
                  this.targetCards.push(
                      {
                        card: foundCards[0],
                        resourceCount: 2
                      }
                  );    
                  game.log(
                    LogMessageType.DEFAULT,
                    "${0} linked ${1} with ${2}",
                    new LogMessageData(LogMessageDataType.PLAYER, player.id),
                    new LogMessageData(LogMessageDataType.CARD, foundCards[0].name),
                    new LogMessageData(LogMessageDataType.CARD, this.name)
                  );             
                  return undefined;
                }
            ));
        }

        if (this.targetCards.length > 0) {
            let robotCards: Array<IProjectCard> = [];
            for (let targetCard of this.targetCards) {
                robotCards.push(targetCard.card);
            }            
            orOptions.options.push(new SelectCard(
                'Select card to double robots resource', robotCards,
                (foundCards: Array<IProjectCard>) => {
                  let resourceCount = 0;
                  for (let targetCard of this.targetCards) {
                    if (targetCard.card.name === foundCards[0].name) {
                      resourceCount = targetCard.resourceCount;
                      targetCard.resourceCount = targetCard.resourceCount * 2;
                    }
                  }
                  game.log(
                    LogMessageType.DEFAULT,
                    "${0} doubled resources on ${1} from ${2} to ${3}",
                    new LogMessageData(LogMessageDataType.PLAYER, player.id),
                    new LogMessageData(LogMessageDataType.CARD, foundCards[0].name),
                    new LogMessageData(LogMessageDataType.STRING, resourceCount.toString()),
                    new LogMessageData(LogMessageDataType.STRING, (resourceCount * 2).toString()),
                  );             
                  return undefined;
                }
            ));            
        }

        return orOptions;
    }    


}
