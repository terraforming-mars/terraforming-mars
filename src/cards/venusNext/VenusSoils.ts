import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {ICard} from '../ICard';
import {CardName} from '../../CardName';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class VenusSoils extends Card {
  constructor() {
    super({
      name: CardName.VENUS_SOILS,
      cardType: CardType.AUTOMATED,
      tags: [Tags.VENUS, Tags.PLANT],
      cost: 20,

      metadata: {
        cardNumber: '257',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).br;
          b.production((pb) => pb.plants(1)).microbes(2).asterix();
        }),
        description: 'Raise Venus 1 step. Increase your Plant production 1 step. Add 2 Microbes to ANOTHER card',
      },
    });
  };

  public canPlay(player: Player): boolean {
    const venusMaxed = player.game.getVenusScaleLevel() === MAX_VENUS_SCALE;
    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS) && !venusMaxed) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST, {floaters: true, microbes: true});
    }

    return true;
  }

  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 1);
    player.game.increaseVenusScaleLevel(player, 1);

    const microbeCards = player.getResourceCards(ResourceType.MICROBE);

    if (microbeCards.length === 0) return undefined;

    if (microbeCards.length === 1) {
      player.addResourceTo(microbeCards[0], {qty: 2, log: true});
      return undefined;
    }

    return new SelectCard(
      'Select card to add 2 microbes',
      'Add microbe(s)',
      microbeCards,
      (foundCards: Array<ICard>) => {
        player.addResourceTo(foundCards[0], {qty: 2, log: true});
        return undefined;
      },
    );
  }
}
