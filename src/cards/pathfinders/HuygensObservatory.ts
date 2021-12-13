import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {OrOptions} from '../../inputs/OrOptions';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectColony} from '../../inputs/SelectColony';
import {ColonyName} from '../../colonies/ColonyName';
import {ColonyModel} from '../../models/ColonyModel';

export class HuygensObservatory extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 27,
      tags: [Tags.SCIENCE, Tags.SPACE],
      name: CardName.HUYGENS_OBSERVATORY,
      cardType: CardType.AUTOMATED,
      victoryPoints: 1,
      tr: {tr: 1},

      metadata: {
        cardNumber: 'Pf61',
        renderData: CardRenderer.builder((b) => b.colonies(1)),
        description: 'Place a colony. MAY BE PLACED ON A COLONY TILE WHERE YOU ALREADY HAVE A COLONY. ' +
          'Trade for free. You may use a Trade Fleet that you used this generation already. Gain 1 TR.',
      },
    });
  }

  public trade(player: Player) {
    const openColonies = player.game.colonies.filter((colony) => colony.isActive && colony.visitor === undefined);
    const coloniesModel: Array<ColonyModel> = player.game.getColoniesModel(openColonies);

    return new SelectColony('Select colony tile to trade with for free', 'Select', coloniesModel, (colonyName: ColonyName) => {
      openColonies.find((colony) => colony.name === colonyName)?.trade(player);
      return undefined;
    });
  }
  public canPlay(player: Player): boolean {
    return player.hasAvailableColonyTileToBuildOn(true);
  }

  public play(player: Player) {
    player.game.defer(new BuildColony(player, true, 'Select colony for Huygens Observatory'));
    player.increaseTerraformRating();

    const game = player.game;
    if (player.tradesThisGeneration === 0) {
      return undefined;
    }
    const orOptions = new OrOptions();
    const visitedColonies = game.colonies.filter((colony) => colony.visitor === player.id);
    if (visitedColonies.length > 0) {
      const coloniesModel = player.game.getColoniesModel(visitedColonies);
      orOptions.options.push(
        new SelectColony(
          'Select a colony to recall a trade fleet from',
          'OK',
          coloniesModel,
          (colonyName: ColonyName) => {
            const colony = game.colonies.find((colony) => colony.name === colonyName);
            if (colony === undefined) {
              throw new Error(`Unknown colony name '${colonyName}'`);
            }
            colony.visitor = undefined;
            // TODO(kberg): counting the trades in a generation is not the same as using trade fleets. :D
            player.tradesThisGeneration--;
            return this.trade(player);
          }));
    }
    const hasFreeTradeFleet = visitedColonies.length < player.getFleetSize();
    if (hasFreeTradeFleet) {
      orOptions.options.push(new SelectOption('Use an available trade fleet', 'OK', () => {
        return this.trade(player);
      }));
    }
    if (orOptions.options.length === 0) {
      return undefined;
    }
    return orOptions;
  }
}
