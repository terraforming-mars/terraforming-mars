import { IProjectCard } from '../IProjectCard';
import { CardName } from '../../CardName';
import { CardType } from '../CardType';
import { Tags } from '../Tags';
import { Player } from '../../Player';
import { ResourceType } from '../../ResourceType';
import { SelectCard } from '../../inputs/SelectCard';
import { Game } from '../../Game';
import { LogMessageType } from '../../LogMessageType';
import { LogMessageData } from '../../LogMessageData';
import { LogMessageDataType } from '../../LogMessageDataType';

export class SelfReplicatingRobots implements IProjectCard {

    public name: CardName = CardName.SELF_REPLICATING_ROBOTS;
    public cost: number = 7;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.ACTIVE;
    public targetCard: IProjectCard | undefined = undefined;
    public resourceType: ResourceType = ResourceType.ROBOT;
    public resourceCount: number = 0;

    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        if (this.targetCard !== undefined && card.name === this.targetCard.name) {
            return this.resourceCount;
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
        if (this.targetCard !== undefined) 
          return true;
        if (player.cardsInHand.filter(card => card.tags.filter(tag => tag === Tags.SPACE || tag === Tags.STEEL).length > 0).length > 0)
          return true;
        return false;
    }

    public action(player: Player, game: Game) {
        if (this.targetCard !== undefined) {
            this.resourceCount = this.resourceCount * 2;
            return undefined;
        }

        const selectableCards = player.cardsInHand.filter(card => card.tags.filter(tag => tag === Tags.SPACE || tag === Tags.STEEL).length > 0);

        if (selectableCards.length > 0) {
            return new SelectCard(
                'Select card to link with Self-Replicating Robots', selectableCards,
                (foundCards: Array<IProjectCard>) => {
                  const projectCardIndex = player.cardsInHand.findIndex((card) => card.name === foundCards[0].name);
                  player.cardsInHand.splice(projectCardIndex, 1);                 
                  this.targetCard = foundCards[0];
                  this.resourceCount = 2;
                  game.log(
                    LogMessageType.DEFAULT,
                    "${0} linked ${1} with Self Replicating Robots",
                    new LogMessageData(LogMessageDataType.PLAYER, player.id),
                    new LogMessageData(LogMessageDataType.CARD, this.targetCard.name)
                  );                  
                  return undefined;
                }
            );
        }
        return undefined;
    }    


}
