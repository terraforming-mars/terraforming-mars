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
import {Colony} from '../../colonies/Colony';
import {DeferredAction} from '../../deferredActions/DeferredAction';

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
        renderData: CardRenderer.builder((b) => b.colonies(1).asterix().trade().asterix().tr(1)),
        description: 'Place a colony. MAY BE PLACED ON A COLONY TILE WHERE YOU ALREADY HAVE A COLONY. ' +
          'Trade for free. You may use a Trade Fleet that you used this generation already, but you may not ' +
          'trade with the tile that fleet came from. Gain 1 TR.',
      },
    });
  }

  private trade(player: Player, colonies: Array<Colony>) {
    return new SelectColony('Select colony tile to trade with for free', 'Select', colonies, (colony: Colony) => {
      colony.trade(player);
      return undefined;
    });
  }

  private tradeableColonies(player: Player) {
    return player.game.colonies.filter((colony) => colony.isActive && colony.visitor === undefined);
  }

  private tryToTrade(player: Player) {
    const game = player.game;
    const tradeableColonies = this.tradeableColonies(player);
    if (tradeableColonies.length === 0) {
      game.log(
        '${0} cannot trade with ${1} because there is no colony they may visit.',
        (b) => b.player(player).card(this));
      return;
    }

    const orOptions = new OrOptions();
    orOptions.title = 'Select a trade fleet';

    const visitedColonies = game.colonies.filter((colony) => colony.visitor === player.id);
    const hasFreeTradeFleet = visitedColonies.length < player.getFleetSize();
    const tradeInput = this.trade(player, tradeableColonies);
    if (visitedColonies.length > 0) {
      orOptions.options.push(
        new SelectColony(
          'Select a colony tile to recall a trade fleet from',
          'OK',
          visitedColonies,
          (colony: Colony) => {
            game.log(
              '${0} is reusing a trade fleet from ${1}',
              (b) => b.player(player).colony(colony));
            colony.visitor = undefined;
            // TODO(kberg): counting the trades in a generation is not the same as using trade fleets. :[
            player.tradesThisGeneration--;
            game.defer(new DeferredAction(player, () => tradeInput));
            return undefined;
          }));
    }
    if (hasFreeTradeFleet) {
      if (orOptions.options.length === 1) {
        orOptions.options.push(new SelectOption('Use an available trade fleet', 'OK', () => {
          game.defer(new DeferredAction(player, () => tradeInput));
          return undefined;
        }));
      } else {
        game.defer(new DeferredAction(player, () => tradeInput));
      }
    }
    if (orOptions.options.length === 1) {
      game.defer(new DeferredAction(player, () => orOptions.options[0]));
    }
    if (orOptions.options.length > 1) {
      game.defer(new DeferredAction(player, () => orOptions));
    }
  }
  public override canPlay(player: Player): boolean {
    return player.hasAvailableColonyTileToBuildOn(true) || this.tradeableColonies(player).length > 0;
  }

  public play(player: Player) {
    player.increaseTerraformRating();
    const game = player.game;

    if (player.hasAvailableColonyTileToBuildOn(true)) {
      game.defer(new BuildColony(player, true, 'Select colony for Huygens Observatory', undefined, {
        cb: () => this.tryToTrade(player),
      }));
    } else {
      game.defer(new DeferredAction(player, () => {
        this.tryToTrade(player);
        return undefined;
      }));
    }
    return undefined;
  }
}

