import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {Resources} from '../../Resources';
import {CardRequirements} from '../CardRequirements';
import {Tags} from '../Tags';

export class PrefabricationofHumanHabitats extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.PREFABRICATION_OF_HUMAN_HABITATS,
      cost: 8,
      tags: [Tags.BUILDING, Tags.CITY],

      requirements: CardRequirements.builder((b) => b.production(Resources.STEEL)),
      metadata: {
        cardNumber: 'Pf02',
        renderData: CardRenderer.builder((b) => {
          b.effect('Cards with a city tag cost 2M€ less.', (eb) => {
            eb.city().played.startEffect.megacredits(-2);
          });
          b.br;
          b.effect('The City standard project costs 2M€ less. STEEL MAY BE USED as if you were playing a Building card.', (eb) => {
            eb.city().asterix().startEffect.megacredits(23).steel(1).brackets;
          });
        }),
        description: 'Requires that you have steel production.',
      },
    });
  }

  public getCardDiscount(_player: Player, card: IProjectCard) {
    return card.tags.includes(Tags.CITY) ? 2 : 0;
  }

  public canAct(player: Player) {
    return player.plants > 0 && player.getResourceCards(ResourceType.ANIMAL).length > 0;
  }

  public action(player: Player) {
    return new SelectCard(
      'Select a card to gain an animal resource',
      'Spend 1 plant',
      player.getResourceCards(ResourceType.ANIMAL),
      (cards) => {
        player.addResource(Resources.PLANTS, -1);
        player.addResourceTo(cards[0], {log: true});
        return undefined;
      });
  }

  public play(player: Player) {
    player.game.increaseTemperature(player, 1);
    return undefined;
  }
}

