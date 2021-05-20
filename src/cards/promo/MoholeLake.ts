import {IActionCard, ICard} from './../ICard';
import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {Card} from '../Card';
import {CardType} from './../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST, MAX_TEMPERATURE, MAX_OCEAN_TILES} from '../../constants';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';

export class MoholeLake extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MOHOLE_LAKE,
      tags: [Tags.BUILDING],
      cost: 31,

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

  public canPlay(player: Player): boolean {
    const temperatureStep = player.game.getTemperature() < MAX_TEMPERATURE ? 1 : 0;
    const oceanStep = player.game.board.getOceansOnBoard() < MAX_OCEAN_TILES ? 1 : 0;
    const totalSteps = temperatureStep + oceanStep;

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(REDS_RULING_POLICY_COST * totalSteps, {steel: true});
    }

    return true;
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
