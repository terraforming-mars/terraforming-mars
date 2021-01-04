import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {SpaceType} from '../../SpaceType';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../CardName';
import {MAX_OXYGEN_LEVEL, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {GlobalParameter} from '../../GlobalParameter';

export class Mangrove extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MANGROVE,
      tags: [Tags.PLANT],
      cost: 12,

      metadata: {
        cardNumber: '059',
        requirements: CardRequirements.builder((b) => b.temperature(4)),
        renderData: CardRenderer.builder((b) => b.greenery(CardRenderItemSize.MEDIUM, true).asterix()),
        description: 'Requires +4 C or warmer. Place a greenery tile ON AN AREA RESERVED FOR OCEAN and raise oxygen 1 step. Disregard normal placement restrictions for this.',
        victoryPoints: 1,
      },
    });
  }

  public canPlay(player: Player, game: Game): boolean {
    const meetsTemperatureRequirements = game.checkMinRequirements(player, GlobalParameter.TEMPERATURE, 4);
    const oxygenMaxed = game.getOxygenLevel() === MAX_OXYGEN_LEVEL;

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oxygenMaxed) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, false, false, false, true) && meetsTemperatureRequirements;
    }

    return meetsTemperatureRequirements;
  }

  public play(player: Player, game: Game) {
    return new SelectSpace('Select ocean space for greenery tile', game.board.getAvailableSpacesForOcean(player), (foundSpace: ISpace) => {
      return game.addGreenery(player, foundSpace.id, SpaceType.OCEAN);
    });
  }
  public getVictoryPoints() {
    return 1;
  }
}
