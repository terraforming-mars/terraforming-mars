import {IActionCard, ICard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {ResourceType} from '../../common/ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';

export class MoholeLake extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MOHOLE_LAKE,
      tags: [Tags.BUILDING],
      cost: 31,
      tr: {temperature: 1, oceans: 1},

      metadata: {
        cardNumber: 'X27',
        renderData: CardRenderer.builder((b) => {
          b.action('Add a microbe or animal to ANOTHER card.', (eb) => {
            eb.empty().startAction.microbes(1).asterix();
            eb.nbsp.or().nbsp.animals(1).asterix();
          }).br;
          b.plants(3).temperature(1).oceans(1);
        }),
        description: 'Gain 3 plants. Raise temperature 1 step, and place 1 ocean tile.',
      },
    });
  }

  public play(player: Player) {
    player.game.increaseTemperature(player, 1);
    player.game.defer(new PlaceOceanTile(player));
    player.plants += 3;
    return undefined;
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const availableCards = player.getResourceCards(ResourceType.MICROBE).concat(player.getResourceCards(ResourceType.ANIMAL));

    if (availableCards.length === 0) {
      return undefined;
    }

    if (availableCards.length === 1) {
      player.addResourceTo(availableCards[0], {log: true});
      return undefined;
    }

    return new SelectCard('Select card to add microbe or animal', 'Add resource', availableCards, (foundCards: Array<ICard>) => {
      player.addResourceTo(foundCards[0], {log: true});
      return undefined;
    });
  }
}
