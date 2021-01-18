import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {Game} from '../../Game';
import {ICard} from '../ICard';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
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

      metadata: {
        cardNumber: '261',
        requirements: CardRequirements.builder((b) => b.venus(16)),
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

  public canPlay(player: Player, game: Game): boolean {
    const meetsVenusRequirements = super.canPlay(player);
    const venusMaxed = game.getVenusScaleLevel() === MAX_VENUS_SCALE;

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !venusMaxed) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, false, false, true, true) && meetsVenusRequirements;
    }

    return meetsVenusRequirements;
  }

  public play(player: Player, game: Game) {
    game.increaseVenusScaleLevel(player, 1);
    const cards = this.getResCards(player);
    if (cards.length === 0) return undefined;

    if (cards.length === 1) {
      player.addResourceTo(cards[0], 1);
      LogHelper.logAddResource(player, cards[0]);
      return undefined;
    }

    return new SelectCard(
      'Select card to add 1 resource',
      'Add resource',
      cards,
      (foundCards: Array<ICard>) => {
        player.addResourceTo(foundCards[0], 1);
        LogHelper.logAddResource(player, foundCards[0]);
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
    return resourceCards.filter((card) => card.tags.indexOf(Tags.VENUS) !== -1);
  }
}
