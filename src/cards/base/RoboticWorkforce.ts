import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {ICard} from '../ICard';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {Units} from '../../Units';
import {played} from '../Options';

export class RoboticWorkforce extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ROBOTIC_WORKFORCE,
      tags: [Tags.SCIENCE],
      cost: 9,
      metadata: {
        cardNumber: '086',
        renderData: CardRenderer.builder((b) => {
          b.text('Copy A', Size.SMALL, true).nbsp;
          b.production((pb) => pb.building(1, {played}));
        }),
        description: 'Duplicate only the production box of one of your building cards.',
      },
    });
  }
  public canPlay(player: Player): boolean {
    return this.getAvailableCards(player).length > 0;
  }

  private isCardApplicable(card: ICard, player: Player): boolean {
    if (!card.tags.includes(Tags.BUILDING)) {
      return false;
    }
    if (card.name === CardName.BIOMASS_COMBUSTORS) {
      return player.game.someoneHasResourceProduction(Resources.PLANTS, 1);
    }
    if (card.name === CardName.HEAT_TRAPPERS) {
      return player.game.someoneHasResourceProduction(Resources.HEAT, 2);
    }
    if (card.name === CardName.GYROPOLIS) {
      return player.getProduction(Resources.ENERGY) >= 2;
    }

    if (card.produce !== undefined) return true;

    if (card.productionBox === undefined || card.productionBox === Units.EMPTY) return false;

    return player.canAdjustProduction(card.productionBox);
  }

  private getAvailableCards(player: Player): Array<ICard> {
    const availableCards: Array<ICard> = player.playedCards.filter((card) => this.isCardApplicable(card, player));
    if (player.corporationCard !== undefined && this.isCardApplicable(player.corporationCard, player)) {
      availableCards.push(player.corporationCard);
    }

    return availableCards;
  }

  public play(player: Player) {
    const availableCards = this.getAvailableCards(player);

    if (availableCards.length === 0) {
      return undefined;
    }

    return new SelectCard('Select builder card to copy', 'Copy', availableCards, (selectedCards: Array<ICard>) => {
      const card: ICard = selectedCards[0];

      player.game.log('${0} copied ${1} production with ${2}', (b) =>
        b.player(player).card(card).card(this));

      if (card.produce) {
        card.produce(player);
      } else if (card.productionBox) {
        player.adjustProduction(card.productionBox);
      } else {
        throw new Error(`Card ${card.name} is not a valid Robotic Workforce card.`);
      }
      return undefined;
    });
  }
}
