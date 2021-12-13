import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {SelectColony} from '../../inputs/SelectColony';
import {ColonyName} from '../../colonies/ColonyName';
import {Game} from '../../Game';

export class CoordinatedRaid extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 5,
      name: CardName.COORDINATED_RAID,
      cardType: CardType.EVENT,
      requirements: CardRequirements.builder((b) => b.colonies(1)),

      metadata: {
        cardNumber: 'Pf64',
        renderData: CardRenderer.builder((b) => b.colonies(1)),
        description: 'Requires at least 1 colony in play. Send one of your unused Trade Fleets to ANY colony tile (can be a tile already used this generation.) ' +
          'Collect the trade bonus and colony bonus for every colony on this tile. Other players do not get their colony bonuses from this action.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.getFleetSize() > player.tradesThisGeneration;
  }

  private static getColony(game: Game, colonyName: ColonyName) {
    const colony = game.colonies.find((colony) => colony.name === colonyName);
    if (colony === undefined) {
      throw new Error(`Colony ${colonyName} not found`);
    }
    return colony;
  }

  public play(player: Player) {
    const colonies = player.game.colonies.filter((colony) => colony.isActive);
    const coloniesModel = player.game.getColoniesModel(colonies);
    return new SelectColony('Select colony tile for trade', 'trade', coloniesModel, (colonyName: ColonyName) => {
      const colony = CoordinatedRaid.getColony(player.game, colonyName);
      colony.trade(player, {selfishTrade: true});
      return undefined;
    });
  }
}
