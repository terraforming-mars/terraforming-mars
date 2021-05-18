import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {ICard} from '../ICard';
import {CardName} from '../../CardName';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class VenusianPlants extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.VENUSIAN_PLANTS,
      cost: 13,
      tags: [Tags.VENUS, Tags.PLANT],

      requirements: CardRequirements.builder((b) => b.venus(16)),
      metadata: {
        cardNumber: '261',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).br.br; // intentional double br
          b.microbes(1).secondaryTag(Tags.VENUS).nbsp;
          b.or().nbsp.animals(1).secondaryTag(Tags.VENUS);
        }),
        description: {
          text: 'Requires Venus 16%. Raise Venus 1 step. Add 1 Microbe or 1 Animal to ANOTHER VENUS CARD',
          align: 'left',
        },
        victoryPoints: 1,
      },
    });
  }

  public canPlay(player: Player): boolean {
    if (!super.canPlay(player)) {
      return false;
    }
    const venusMaxed = player.game.getVenusScaleLevel() === MAX_VENUS_SCALE;

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS) && !venusMaxed) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST, {floaters: true, microbes: true});
    }

    return true;
  }

  public play(player: Player) {
    player.game.increaseVenusScaleLevel(player, 1);
    const cards = this.getResCards(player);
    if (cards.length === 0) return undefined;

    if (cards.length === 1) {
      player.addResourceTo(cards[0], {log: true});
      return undefined;
    }

    return new SelectCard(
      'Select card to add 1 resource',
      'Add resource',
      cards,
      (foundCards: Array<ICard>) => {
        player.addResourceTo(foundCards[0], {log: true});
        return undefined;
      },
    );
  }

  public getVictoryPoints() {
    return 1;
  }

  public getResCards(player: Player): ICard[] {
    let resourceCards = player.getResourceCards(ResourceType.MICROBE);
    resourceCards = resourceCards.concat(player.getResourceCards(ResourceType.ANIMAL));
    return resourceCards.filter((card) => card.tags.includes(Tags.VENUS));
  }
}
