import {ICorporationCard} from '../corporation/ICorporationCard';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {SelectCard} from '../../inputs/SelectCard';
import {ICard} from '../ICard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {digit} from '../Options';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../../common/turmoil/PartyName';
import {REDS_RULING_POLICY_COST} from '../../../common/constants';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {TITLES} from '../../inputs/titles';

export class ProjectWorkshop extends Card implements ICorporationCard {
  constructor() {
    super({
      name: CardName.PROJECT_WORKSHOP,
      tags: [Tag.EARTH],
      startingMegaCredits: 39,
      type: CardType.CORPORATION,

      behavior: {
        stock: {steel: 1, titanium: 1},
      },

      firstAction: {
        text: 'Draw a blue card',
        drawCard: {count: 1, type: CardType.ACTIVE},
      },

      metadata: {
        cardNumber: 'R45',
        description: 'You start with 39 M€, 1 steel and 1 titanium. As your first action, draw a blue card.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(39).steel(1).titanium(1).cards(1, {secondaryTag: AltSecondaryTag.BLUE});
          b.corpBox('action', (cb) => {
            cb.vSpace(Size.LARGE);
            cb.action(undefined, (eb) => {
              eb.text('flip', Size.SMALL, true).cards(1, {secondaryTag: AltSecondaryTag.BLUE});
              eb.startAction.text('?', Size.MEDIUM, true).tr(1, {size: Size.SMALL});
              eb.cards(2, {digit});
            });
            cb.vSpace(Size.SMALL);
            cb.action('Flip and discard a played blue card to convert any VP on it into TR and draw 2 cards, or spend 3 M€ to draw a blue card.', (eb) => {
              eb.or().megacredits(3).startAction.cards(1, {secondaryTag: AltSecondaryTag.BLUE});
            });
          });
        }),
      },
    });
  }

  private getEligibleCards(player: IPlayer) {
    const cards = player.playedCards.filter((card) => card.type === CardType.ACTIVE);
    if (!PartyHooks.shouldApplyPolicy(player, PartyName.REDS, 'rp01')) {
      return cards;
    }
    return cards.filter((card) => {
      const vp = card.getVictoryPoints(player);
      if (vp <= 0) {
        return true;
      }
      return player.canAfford(REDS_RULING_POLICY_COST * vp);
    });
  }

  public canAct(player: IPlayer): boolean {
    if (player.canAfford(3)) return true;
    return this.getEligibleCards(player).length > 0;
  }

  public action(player: IPlayer) {
    const activeCards = this.getEligibleCards(player);

    const flipBlueCard = new SelectOption(
      'Flip and discard a played blue card',
      'Select')
      .andThen(() => {
        if (activeCards.length === 1) {
          this.convertCardPointsToTR(player, activeCards[0]);
          player.discardPlayedCard(activeCards[0]);
          player.drawCard(2);
          return undefined;
        }

        return new SelectCard<IProjectCard>(
          'Select active card to discard',
          'Discard',
          activeCards)
          .andThen(
            ([card]) => {
              this.convertCardPointsToTR(player, card);
              player.discardPlayedCard(card);
              player.drawCard(2);
              return undefined;
            },
          );
      });

    const drawBlueCard = new SelectOption('Spend 3 M€ to draw a blue card', 'Draw card').andThen(() => {
      player.game.defer(new SelectPaymentDeferred(player, 3,
        {title: TITLES.payForCardAction(this.name)}))
        .andThen(() => player.drawCard(1, {cardType: CardType.ACTIVE}));
      return undefined;
    });

    if (activeCards.length === 0) return drawBlueCard;
    // TODO(kberg): Take reds into account
    if (!player.canAfford(3)) return flipBlueCard;

    return new OrOptions(drawBlueCard, flipBlueCard);
  }

  private convertCardPointsToTR(player: IPlayer, card: ICard) {
    const steps = card.getVictoryPoints(player);
    // TODO(kberg): this doesn't reduce VPs below 0. What to do?
    if (steps > 0) {
      player.increaseTerraformRating(steps, {log: true});
    } else if (steps < 0) {
      player.decreaseTerraformRating(-steps, {log: true});
    }
  }
}
