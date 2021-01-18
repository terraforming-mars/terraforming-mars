import {IActionCard, ICard} from './../ICard';
import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {CardType} from './../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {LogHelper} from '../../LogHelper';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST, MAX_TEMPERATURE, MAX_OCEAN_TILES} from '../../constants';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MoholeLake implements IActionCard, IProjectCard {
    public cost = 31;
    public tags = [Tags.BUILDING];
    public name = CardName.MOHOLE_LAKE;
    public cardType = CardType.ACTIVE;

    public canPlay(player: Player, game: Game): boolean {
      const temperatureStep = game.getTemperature() < MAX_TEMPERATURE ? 1 : 0;
      const oceanStep = game.board.getOceansOnBoard() < MAX_OCEAN_TILES ? 1 : 0;
      const totalSteps = temperatureStep + oceanStep;

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(REDS_RULING_POLICY_COST * totalSteps, game, true);
      }

      return true;
    }

    public play(player: Player, game: Game) {
      game.increaseTemperature(player, 1);
      game.defer(new PlaceOceanTile(player));
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
        player.addResourceTo(availableCards[0]);
        LogHelper.logAddResource(player, availableCards[0], 1);
        return undefined;
      }

      return new SelectCard('Select card to add microbe or animal', 'Add resource(s)', availableCards, (foundCards: Array<ICard>) => {
        player.addResourceTo(foundCards[0]);
        LogHelper.logAddResource(player, foundCards[0], 1);
        return undefined;
      });
    }
    public metadata: CardMetadata = {
      cardNumber: 'X22',
      renderData: CardRenderer.builder((b) => {
        b.action('Add a microbe or animal to ANOTHER card.', (eb) => {
          eb.empty().startAction.microbes(1).asterix();
          eb.nbsp.or().nbsp.animals(1).asterix();
        }).br;
        b.plants(3).temperature(1).oceans(1);
      }),
      description: 'Gain 3 plants. Raise temperature 1 step, and place 1 ocean tile.',
    }
}
