import {ICorporationCard} from '../corporation/ICorporationCard';
import {Player} from '../../Player';
import {Tags} from '../../common/cards/Tags';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {SelectCard} from '../../inputs/SelectCard';
import {ICard} from '../ICard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../common/cards/render/Size';
import {AltSecondaryTag} from '../../common/cards/render/AltSecondaryTag';
import {Resources} from '../../common/Resources';
import {digit} from '../Options';

export class ProjectWorkshop extends Card implements ICorporationCard {
  constructor() {
    super({
      name: CardName.PROJECT_WORKSHOP,
      tags: [Tags.EARTH],
      startingMegaCredits: 39,
      cardType: CardType.CORPORATION,
      initialActionText: 'Draw a blue card',

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

  public play(player: Player) {
    player.steel = 1;
    player.titanium = 1;
    return undefined;
  }

  public initialAction(player: Player) {
    player.drawCard(1, {cardType: CardType.ACTIVE});
    return undefined;
  }

  public canAct(player: Player): boolean {
    const activeCards = player.getCardsByCardType(CardType.ACTIVE);
    return activeCards.length > 0 || player.megaCredits >= 3;
  }

  public action(player: Player) {
    const activeCards = player.getCardsByCardType(CardType.ACTIVE);

    const flipBlueCard = new SelectOption(
      'Flip and discard a played blue card',
      'Select',
      () => {
        if (activeCards.length === 1) {
          this.convertCardPointsToTR(player, activeCards[0]);
          this.discardPlayedCard(player, activeCards[0]);
          player.drawCard(2);
          return undefined;
        }

        return new SelectCard<IProjectCard>(
          'Select active card to discard',
          'Discard',
          activeCards,
          (foundCards) => {
            this.convertCardPointsToTR(player, foundCards[0]);
            this.discardPlayedCard(player, foundCards[0]);
            player.drawCard(2);
            return undefined;
          },
        );
      },
    );

    const drawBlueCard = new SelectOption('Spend 3 M€ to draw a blue card', 'Draw card', () => {
      player.deductResource(Resources.MEGACREDITS, 3);
      player.drawCard(1, {cardType: CardType.ACTIVE});
      return undefined;
    });

    if (activeCards.length === 0) return drawBlueCard;
    // TODO(kberg): Take reds into account
    if (!player.canAfford(3)) return flipBlueCard;

    return new OrOptions(drawBlueCard, flipBlueCard);
  }

  private convertCardPointsToTR(player: Player, card: ICard) {
    const steps = card.getVictoryPoints(player);
    // TODO(kberg): this doesn't reduce VPs below 0. What to do?
    if (steps !== 0) {
      player.increaseTerraformRatingSteps(steps, {log: true});
    }
  }

  private discardPlayedCard(player: Player, card: IProjectCard) {
    const cardIndex = player.playedCards.findIndex((c) => c.name === card.name);
    player.playedCards.splice(cardIndex, 1);
    player.game.dealer.discard(card);

    if (card.onDiscard) {
      card.onDiscard(player);
    }

    player.game.log('${0} flipped and discarded ${1}', (b) => b.player(player).card(card));
  }
}
