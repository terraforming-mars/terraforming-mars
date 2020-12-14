import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from './PartyName';
import {Game} from '../../Game';
import {Bonus} from '../Bonus';
import {Policy} from '../Policy';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {ISpace} from '../../ISpace';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {MAX_OCEAN_TILES, MAX_OXYGEN_LEVEL, MAX_TEMPERATURE, MAX_VENUS_SCALE, MIN_OXYGEN_LEVEL, MIN_TEMPERATURE, MIN_VENUS_SCALE} from '../../constants';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {RemoveOceanTile} from '../../deferredActions/RemoveOceanTile';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';

export class Reds extends Party implements IParty {
  name = PartyName.REDS;
  description = 'Wishes to preserve the red planet.';
  bonuses = [new RedsBonus01(), new RedsBonus02()];
  policies = [new RedsPolicy01(), new RedsPolicy02(), new RedsPolicy03(), new RedsPolicy04()];
}

export class RedsBonus01 implements Bonus {
  id = 'rb01';
  description = 'The player(s) with the lowest TR gains 1 TR';
  isDefault = true;

  grant(game: Game) {
    const players = game.getPlayers();

    if (game.isSoloMode() && players[0].getTerraformRating() <= 20) {
      players[0].increaseTerraformRating(game);
    } else {
      players.sort((p1, p2) => p1.getTerraformRating() - p2.getTerraformRating());
      const min = players[0].getTerraformRating();

      while (players.length > 0 && players[0].getTerraformRating() === min) {
        players[0].increaseTerraformRating(game);
        players.shift();
      }
    }
  }
}

export class RedsBonus02 implements Bonus {
  id = 'rb02';
  description = 'The player(s) with the highest TR loses 1 TR';

  grant(game: Game) {
    const players = game.getPlayers();

    if (game.isSoloMode() && players[0].getTerraformRating() > 20) {
      players[0].decreaseTerraformRating();
    } else {
      players.sort((p1, p2) => p2.getTerraformRating() - p1.getTerraformRating());
      const max = players[0].getTerraformRating();

      while (players.length > 0 && players[0].getTerraformRating() === max) {
        players[0].decreaseTerraformRating();
        players.shift();
      }
    }
  }
}

export class RedsPolicy01 implements Policy {
  id = 'rp01';
  isDefault = true;
  description: string = 'Whenever you take an action that raises TR, you MUST pay 3 MC per step raised';
}

export class RedsPolicy02 implements Policy {
  id = 'rp02';
  description: string = 'After you place a tile, pay 3 MC or as much as possible';

  onTilePlaced(player: Player, _space: ISpace, game: Game) {
    let amountPlayerHas: number = player.megaCredits;
    if (player.isCorporation(CardName.HELION)) amountPlayerHas += player.heat;

    const amountToPay = Math.min(amountPlayerHas, 3);
    if (amountToPay > 0) {
      game.defer(new SelectHowToPayDeferred(player, amountToPay, false, false, 'Select how to pay for tile placement'));
    }
  }
}

export class RedsPolicy03 implements Policy {
  id = 'rp03';
  description: string = 'Pay 4 MC to reduce a non-maxed global parameter 1 step (do not gain any track bonuses)';

  canAct(player: Player, game: Game) {
    if (game.marsIsTerraformed()) return false;

    const temperature = game.getTemperature();
    const oceansPlaced = game.board.getOceansOnBoard();
    const oxygenLevel = game.getOxygenLevel();
    const venusScaleLevel = game.getVenusScaleLevel();

    if (temperature === MIN_TEMPERATURE && oceansPlaced === 0 && oxygenLevel === MIN_OXYGEN_LEVEL && venusScaleLevel === MIN_VENUS_SCALE) {
      return false;
    }

    return player.canAfford(4) && player.turmoilPolicyActionUsed === false;
  }

  action(player: Player, game: Game) {
    game.log('${0} used Turmoil Reds action', (b) => b.player(player));
    player.turmoilPolicyActionUsed = true;

    game.defer(new SelectHowToPayDeferred(
      player,
      4,
      false,
      false,
      'Select how to pay for action',
      () => {
        const orOptions = new OrOptions();

        // Decrease temperature option
        const temperature = game.getTemperature();
        const canDecreaseTemperature = temperature > MIN_TEMPERATURE && temperature !== MAX_TEMPERATURE;

        if (canDecreaseTemperature) {
          orOptions.options.push(new SelectOption('Decrease temperature', 'Confirm', () => {
            game.increaseTemperature(player, -1);
            game.log('${0} decreased temperature 1 step', (b) => b.player(player));
            return undefined;
          }));
        }

        // Remove ocean option
        const oceansPlaced = game.board.getOceansOnBoard();
        const canRemoveOcean = oceansPlaced > 0 && oceansPlaced !== MAX_OCEAN_TILES;

        if (canRemoveOcean) {
          orOptions.options.push(new SelectOption('Remove an ocean tile', 'Confirm', () => {
            game.defer(new RemoveOceanTile(player, game, 'Turmoil Reds action - Remove an Ocean tile from the board'));
            return undefined;
          }));
        }

        // Decrease oxygen level option
        const oxygenLevel = game.getOxygenLevel();
        const canDecreaseOxygen = oxygenLevel > MIN_OXYGEN_LEVEL && oxygenLevel !== MAX_OXYGEN_LEVEL;

        if (canDecreaseOxygen) {
          orOptions.options.push(new SelectOption('Decrease oxygen level', 'Confirm', () => {
            game.increaseOxygenLevel(player, -1);
            game.log('${0} decreased oxygen level 1 step', (b) => b.player(player));
            return undefined;
          }));
        }

        // Decrease Venus scale option
        const venusScaleLevel = game.getVenusScaleLevel();
        const canDecreaseVenus = game.gameOptions.venusNextExtension === true && venusScaleLevel > MIN_VENUS_SCALE && venusScaleLevel !== MAX_VENUS_SCALE;

        if (canDecreaseVenus) {
          orOptions.options.push(new SelectOption('Decrease Venus scale', 'Confirm', () => {
            game.increaseVenusScaleLevel(player, -1);
            game.log('${0} decreased Venus scale level 1 step', (b) => b.player(player));
            return undefined;
          }));
        }

        if (orOptions.options.length === 1) return orOptions.options[0].cb();

        game.defer(new DeferredAction(player, () => orOptions));
        return undefined;
      },
    ));

    return undefined;
  }
}

export class RedsPolicy04 implements Policy {
  id = 'rp04';
  description: string = 'Whenever you raise a global parameter, decrease your MC production 1 step per step raised if possible';
}
