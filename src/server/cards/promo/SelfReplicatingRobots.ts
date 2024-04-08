import {IProjectCard, isIProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {SelectCard} from '../../inputs/SelectCard';
import {OrOptions} from '../../inputs/OrOptions';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {BasePlayerInput, PlayerInput} from '../../PlayerInput';
import {ICard} from '../ICard';
import {CardResource} from '../../../common/CardResource';
import {Priority} from '../../deferredActions/Priority';
import {SelectCardModel} from '../../../common/models/PlayerInputModel';
import {InputResponse, isSelectCardResponse} from '../../../common/inputs/InputResponse';
import {CardModel} from '../../../common/models/CardModel';
import {newProjectCard} from '../../../server/createCard';

export class SelfReplicatingRobots extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.SELF_REPLICATING_ROBOTS,
      cost: 7,
      resourceType: CardResource.RESOURCE_CUBE,

      requirements: {tag: Tag.SCIENCE, count: 2},
      metadata: {
        cardNumber: '210',
        renderData: CardRenderer.builder((b) => {
          b.action('Reveal and place a SPACE OR BUILDING card here from hand, and place 2 resources on it, OR double the resources on a card here.', (eb) => {
            eb.empty().startAction.selfReplicatingRobots();
            eb.nbsp.or().nbsp.arrow().multiplierWhite().text('x2');
          }).br;
          b.text('Effect: Card here may be played as if from hand with its cost reduced by the number of resources on it.', Size.TINY, true);
        }),
        description: 'Requires 2 science tags.',
      },
    });
  }

  /** The player this card was played by. Property is only set after the card is played. */
  public player: IPlayer | undefined;

  public data: {
    /** Names of attached cards are maped to an amount of SRR resources */
    attachedCards: Partial<Record<CardName, number>>,
  } = {attachedCards: {}};

  /** Returns the sum of all resources on attached cards */
  public override get resourceCount(): number {
    let count = 0;
    if (this.hasAttachedCards()) {
      count = Object.values(this.data.attachedCards).reduce((acc, value) => {
        acc += value
        return acc
      }, 0);
    }
    return count;
  }

  /** When resources are added here, create a new deferred action */
  public override set resourceCount(amount: number) {
    const player = this.player;
    if (player !== undefined) {
      if (Object.keys(this.data.attachedCards).length > 0) {
        player.defer(this.selectRobotCard(amount), Priority.GAIN_RESOURCE_OR_PRODUCTION);
      } else {
        player.game.log(`${this.name} has no attached cards to add resources to.`);
      }
    }
  }

  /** Set the local player field */
  public override bespokePlay(player: IPlayer): PlayerInput | undefined {
    this.player = player;
    return undefined;
  }

  public override getCardDiscount(_player: IPlayer, card: IProjectCard): number {
    return this.data.attachedCards[card.name] ?? 0;
  }

  /** Array of building and space cards in the player's hand */
  private attachableCards(): Array<IProjectCard> {
    return this.player?.cardsInHand.filter((card) =>
      card.tags.some((tag) => tag === Tag.SPACE || tag === Tag.BUILDING) &&
       this.data.attachedCards[card.name] === undefined,
    ) ?? [];
  }

  private hasAttachedCards(): boolean {
    return Object.keys(this.data.attachedCards).length > 0;
  }

  public canAct(_player: IPlayer): boolean {
    return this.hasAttachedCards() || this.attachableCards().length > 0;
  }

  public action(player: IPlayer) {
    const orOptions = new OrOptions();
    // Double Resources on an attached card
    if (this.hasAttachedCards()) {
      orOptions.options.push(this.selectRobotCard('double'));
    }
    // Attach a new card to this card
    if (this.attachableCards().length > 0) {
      orOptions.options.push(
        new SelectCard(
          'Select card to link with Self-Replicating Robots',
          'Link card',
          this.attachableCards(),
          {played: false},
        ).andThen(([card]) => {
          this.data.attachedCards[card.name] = 2;
          player.game.log('${0} linked ${1} with ${2}', (b) => b.player(player).card(card).card(this));
          return undefined;
        }));
    }
    return orOptions;
  }

  /** Remove the card from the record, if it */
  onCardPlayed(_player: IPlayer, card: ICard): void | PlayerInput | undefined {
    if (isIProjectCard(card)) {
      this.data.attachedCards[card.name] = undefined;
    }
  }

  /** Returns a custom PlayerInput utilizing the SelectCard model */
  public selectRobotCard(amount: 'double' | number) {
    const srr = this;
    const player = this.player;
    if (player !== undefined) {
      return new class extends BasePlayerInput<undefined> {
        constructor() {
          super('card', amount === 'double' ? 'Select card to double robots resource' : 'Select card to add robots resource(s)');
          this.buttonLabel = amount === 'double' ? 'Double resources' : 'Add Resource(s)';
        }
        public override toModel(_player: IPlayer): SelectCardModel {
          return {
            title: this.title,
            buttonLabel: this.buttonLabel,
            type: 'card',
            cards: selfReplicatingRobotsCardsToModel(srr),
            max: 1,
            min: 1,
            showOnlyInLearnerMode: false,
            selectBlueCardAction: false,
            showOwner: false,
          };
        }
        public override process(response: InputResponse, _player: IPlayer): PlayerInput | undefined {
          if (!isSelectCardResponse(response)) {
            throw new Error('Not a valid SelectCardResponse');
          }
          if (response.cards.length !== 1) {
            throw new Error('Must select exactly 1 card');
          }
          const cardName = response.cards[0];
          const resourceCount = srr.data.attachedCards[cardName];
          if (resourceCount !== undefined) {
            const total = amount === 'double' ? resourceCount * 2 : resourceCount + amount;
            srr.data.attachedCards[cardName] = total;
            player.game.log('${0} added resources on ${1} from ${2} to ${3}', (b) => {
              b.player(player).cardName(cardName).number(resourceCount).number(total);
            });
          } else {
            throw new Error('Selected card is not attached to Self-Replicating Robots');
          }
          return this.cb(undefined);
        }
      };
    } else {
      throw new Error('Cannot call SelectRobotCard before Self-Replicating Robots has been played');
    }
  }
}

function selfReplicatingRobotsCardsToModel(srr: SelfReplicatingRobots): Array<CardModel> {
  return Object.keys(srr.data.attachedCards).map((key) => {
    const cardName = key as CardName;
    const card = newProjectCard(cardName);
    let cardCost: number | undefined;
    if (card) cardCost = srr.player?.getCardCost(card);
    return {
      resources: srr.data.attachedCards[cardName],
      name: cardName,
      calculatedCost: cardCost,
      isSelfReplicatingRobotsCard: true,
    };
  });
}
