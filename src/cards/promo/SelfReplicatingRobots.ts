import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {Game} from '../../Game';
import {OrOptions} from '../../inputs/OrOptions';

export interface RobotCard {
    card: IProjectCard;
    resourceCount: number;
}

export class SelfReplicatingRobots implements IProjectCard {
    public name = CardName.SELF_REPLICATING_ROBOTS;
    public cost = 7;
    public tags = [];
    public cardType = CardType.ACTIVE;
    public targetCards: Array<RobotCard> = [];

    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard): number {
      for (const targetCard of this.targetCards) {
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
      if (this.targetCards.length > 0) {
        return true;
      }
      if (player.cardsInHand.filter((card) => card.tags.filter((tag) => tag === Tags.SPACE || tag === Tags.STEEL).length > 0).length > 0) {
        return true;
      }
      return false;
    }

    public action(player: Player, game: Game) {
      const orOptions = new OrOptions();
      const selectableCards = player.cardsInHand.filter((card) => card.tags.filter((tag) => tag === Tags.SPACE || tag === Tags.STEEL).length > 0);

      if (selectableCards.length > 0) {
        orOptions.options.push(new SelectCard(
          'Select card to link with Self-Replicating Robots',
          'Link card', selectableCards,
          (foundCards: Array<IProjectCard>) => {
            const projectCardIndex = player.cardsInHand.findIndex((card) => card.name === foundCards[0].name);
            player.cardsInHand.splice(projectCardIndex, 1);
            this.targetCards.push(
              {
                card: foundCards[0],
                resourceCount: 2,
              },
            );
            game.log('${0} linked ${1} with ${2}', (b) => b.player(player).card(foundCards[0]).card(this));
            return undefined;
          },
        ));
      }

      if (this.targetCards.length > 0) {
        const robotCards: Array<IProjectCard> = [];
        for (const targetCard of this.targetCards) {
          robotCards.push(targetCard.card);
        }
        orOptions.options.push(new SelectCard(
          'Select card to double robots resource', 'Double resource', robotCards,
          (foundCards: Array<IProjectCard>) => {
            let resourceCount = 0;
            for (const targetCard of this.targetCards) {
              if (targetCard.card.name === foundCards[0].name) {
                resourceCount = targetCard.resourceCount;
                targetCard.resourceCount = targetCard.resourceCount * 2;
              }
            }
            game.log('${0} doubled resources on ${1} from ${2} to ${3}', (b) => {
              b.player(player).card(foundCards[0]).number(resourceCount).number(resourceCount * 2);
            });
            return undefined;
          },
        ));
      }

      return orOptions;
    }
}
