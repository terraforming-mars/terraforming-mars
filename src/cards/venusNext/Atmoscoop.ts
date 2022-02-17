import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {ResourceType} from '../../common/ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {ICard} from '../ICard';
import {CardName} from '../../common/cards/CardName';
import * as constants from '../../common/constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../common/turmoil/PartyName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {Card} from '../Card';

export class Atmoscoop extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ATMOSCOOP,
      cost: 22,
      tags: [Tags.JOVIAN, Tags.SPACE],

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 3)),
      victoryPoints: 1,

      metadata: {
        cardNumber: '217',
        description: 'Requires 3 Science tags. Either raise the temperature 2 steps, or raise Venus 2 steps. Add 2 Floaters to ANY card.',
        renderData: CardRenderer.builder((b) => {
          b.temperature(2).or(Size.SMALL).venus(2).br;
          b.floaters(2).asterix();
        }),
      },
    });
  }

  public override canPlay(player: Player): boolean {
    const remainingTemperatureSteps = (constants.MAX_TEMPERATURE - player.game.getTemperature()) / 2;
    const remainingVenusSteps = (constants.MAX_VENUS_SCALE - player.game.getVenusScaleLevel()) / 2;
    const stepsRaised = Math.min(remainingTemperatureSteps, remainingVenusSteps, 2);

    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) {
      return player.canAfford(this.cost + constants.REDS_RULING_POLICY_COST * stepsRaised, {titanium: true});
    }

    return true;
  }

  public play(player: Player) {
    const game = player.game;
    const floaterCards = player.getResourceCards(ResourceType.FLOATER);

    if (this.temperatureIsMaxed(game) && this.venusIsMaxed(game) && floaterCards.length === 0) {
      return undefined;
    }

    const increaseTemp = new SelectOption('Raise temperature 2 steps', 'Raise temperature', () => {
      game.increaseTemperature(player, 2);
      return undefined;
    });
    const increaseVenus = new SelectOption('Raise Venus 2 steps', 'Raise venus', () => {
      game.increaseVenusScaleLevel(player, 2);
      return undefined;
    });
    const increaseTempOrVenus = new OrOptions(increaseTemp, increaseVenus);
    increaseTempOrVenus.title = 'Choose global parameter to raise';

    const addFloaters = new SelectCard(
      'Select card to add 2 floaters',
      'Add floaters',
      floaterCards,
      (foundCards: Array<ICard>) => {
        player.addResourceTo(foundCards[0], {qty: 2, log: true});
        return undefined;
      },
    );

    if (!this.temperatureIsMaxed(game) && this.venusIsMaxed(game)) {
      player.game.increaseTemperature(player, 2);
    } else if (this.temperatureIsMaxed(game) && !this.venusIsMaxed(game)) {
      player.game.increaseVenusScaleLevel(player, 2);
    }

    switch (floaterCards.length) {
    case 1:
      player.addResourceTo(floaterCards[0], {qty: 2, log: true});
      // Intentional fall-through

    case 0:
      if (!this.temperatureIsMaxed(game) && !this.venusIsMaxed(game)) {
        return increaseTempOrVenus;
      }
      return undefined;

    default:
      if (!this.temperatureIsMaxed(game) && !this.venusIsMaxed(game)) {
        increaseTempOrVenus.cb = () => addFloaters;
        return increaseTempOrVenus;
      }
      return addFloaters;
    }
  }

  private temperatureIsMaxed(game: Game) {
    return game.getTemperature() === constants.MAX_TEMPERATURE;
  }

  private venusIsMaxed(game: Game) {
    return game.getVenusScaleLevel() === constants.MAX_VENUS_SCALE;
  }
}
