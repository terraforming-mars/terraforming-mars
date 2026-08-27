import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {IBonus} from '../Bonus';
import {IPolicy} from '../Policy';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {MAXIMUM_HABITAT_RATE, MAXIMUM_LOGISTIC_RATE, MAXIMUM_MINING_RATE, MAX_OXYGEN_LEVEL, MAX_TEMPERATURE, MAX_VENUS_SCALE, MIN_OXYGEN_LEVEL, MIN_TEMPERATURE, MIN_VENUS_SCALE, POLITICAL_AGENDAS_MAX_ACTION_USES} from '../../../common/constants';
import {RemoveOceanTile} from '../../deferredActions/RemoveOceanTile';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {GlobalParameter} from '../../../common/GlobalParameter';
import {TITLES} from '../../inputs/titles';

export class Reds extends Party implements IParty {
  readonly name = PartyName.REDS;
  readonly bonuses = [REDS_BONUS_1, REDS_BONUS_2];
  readonly policies = [REDS_POLICY_1, REDS_POLICY_2, REDS_POLICY_3, REDS_POLICY_4];
}

class RedsBonus01 implements IBonus {
  readonly id = 'rb01' as const;
  readonly description = 'The player(s) with the lowest TR gains 1 TR';

  getScore(player: IPlayer): number {
    return player.terraformRating;
  }

  grant(game: IGame) {
    if (game.isSoloMode()) {
      const player = game.players[0];
      if (player.terraformRating <= 20) {
        player.increaseTerraformRating();
      }
    }
    const min = Math.min(...game.players.map((p) => p.terraformRating));

    game.players.forEach((player) => {
      if (player.terraformRating === min) {
        player.increaseTerraformRating();
      }
    });
  }
}

class RedsBonus02 implements IBonus {
  readonly id = 'rb02' as const;
  readonly description = 'The player(s) with the highest TR loses 1 TR';

  getScore(player: IPlayer): number {
    return player.terraformRating;
  }

  grant(game: IGame) {
    if (game.isSoloMode()) {
      const player = game.players[0];
      if (player.terraformRating > 20) {
        player.decreaseTerraformRating();
      }
    }
    const max = Math.max(...game.players.map((p) => p.terraformRating));

    game.players.forEach((player) => {
      if (player.terraformRating === max) {
        player.decreaseTerraformRating();
      }
    });
  }
}

class RedsPolicy01 implements IPolicy {
  readonly id = 'rp01' as const;
  readonly description = 'When you take an action that raises TR, you MUST pay 3 M€ per step raised';
}

class RedsPolicy02 implements IPolicy {
  readonly id = 'rp02' as const;
  readonly description = 'When you place a tile, pay 3 M€ or as much as possible';

  onTilePlaced(player: IPlayer) {
    let amountPlayerHas = player.megaCredits;
    if (player.tableau.has(CardName.HELION)) {
      amountPlayerHas += player.heat;
    }

    const amountToPay = Math.min(amountPlayerHas, 3);
    if (amountToPay > 0) {
      player.game.defer(new SelectPaymentDeferred(player, amountToPay, {title: 'Select how to pay for tile placement'}));
    }
  }
}

class RedsPolicy03 implements IPolicy {
  readonly id = 'rp03' as const;
  readonly description = 'Pay 4 M€ to reduce a non-maxed global parameter 1 step (do not gain any track bonuses)';

  private canDecrease(game: IGame, parameter: GlobalParameter) {
    switch (parameter) {
    case GlobalParameter.TEMPERATURE:
      const temp = game.getTemperature();
      return temp > MIN_TEMPERATURE && temp !== MAX_TEMPERATURE;
    case GlobalParameter.OCEANS:
      return game.canRemoveOcean();
    case GlobalParameter.OXYGEN:
      const oxygenLevel = game.getOxygenLevel();
      return oxygenLevel > MIN_OXYGEN_LEVEL && oxygenLevel !== MAX_OXYGEN_LEVEL;
    case GlobalParameter.VENUS:
      const venusScaleLevel = game.getVenusScaleLevel();
      return game.gameOptions.venusNextExtension === true && venusScaleLevel > MIN_VENUS_SCALE && venusScaleLevel !== MAX_VENUS_SCALE;
    case GlobalParameter.MOON_HABITAT_RATE:
      if (game.moonData) {
        const rate = game.moonData.habitatRate;
        return rate > 0 && rate !== MAXIMUM_HABITAT_RATE;
      }
      return false;
    case GlobalParameter.MOON_LOGISTIC_RATE:
      if (game.moonData) {
        const rate = game.moonData.logisticRate;
        return rate > 0 && rate !== MAXIMUM_LOGISTIC_RATE;
      }
      return false;
    case GlobalParameter.MOON_MINING_RATE:
      if (game.moonData) {
        const rate = game.moonData.miningRate;
        return rate > 0 && rate !== MAXIMUM_MINING_RATE;
      }
      return false;
    }
  }

  canAct(player: IPlayer) {
    const game = player.game;
    if (game.marsIsTerraformed()) {
      return false;
    }

    const temperature = game.getTemperature();
    const oceansPlaced = game.board.getOceanSpaces().length;
    const oxygenLevel = game.getOxygenLevel();
    const venusScaleLevel = game.getVenusScaleLevel();

    const basicParametersAtMinimum =
      temperature === MIN_TEMPERATURE &&
      oceansPlaced === 0 &&
      oxygenLevel === MIN_OXYGEN_LEVEL &&
      venusScaleLevel === MIN_VENUS_SCALE;

    const moonData = player.game.moonData;
    const moonParametersAtMinimum = moonData === undefined ? true : Math.max(moonData.habitatRate, moonData.logisticRate, moonData.miningRate) === 0;

    if (basicParametersAtMinimum && moonParametersAtMinimum) {
      return false;
    }

    return player.canAfford(4) && player.politicalAgendasActionUsedCount < POLITICAL_AGENDAS_MAX_ACTION_USES;
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil ${1} action', (b) => b.player(player).partyName(PartyName.REDS));
    player.politicalAgendasActionUsedCount += 1;

    game.defer(new SelectPaymentDeferred(player, 4, {title: TITLES.payForPartyAction(PartyName.REDS)}))
      .andThen(() => {
        const orOptions = new OrOptions();

        // Decrease temperature option
        if (this.canDecrease(game, GlobalParameter.TEMPERATURE)) {
          orOptions.options.push(new SelectOption('Decrease temperature').andThen(() => {
            game.increaseTemperature(player, -1);
            game.log('${0} decreased temperature 1 step', (b) => b.player(player));
            return undefined;
          }));
        }

        // Remove ocean option
        if (this.canDecrease(game, GlobalParameter.OCEANS)) {
          orOptions.options.push(new SelectOption('Remove an ocean tile').andThen(() => {
            game.defer(new RemoveOceanTile(player, 'Turmoil Reds action - Remove an Ocean tile from the board'));
            return undefined;
          }));
        }

        // Decrease oxygen level option
        if (this.canDecrease(game, GlobalParameter.OXYGEN)) {
          orOptions.options.push(new SelectOption('Decrease oxygen level').andThen(() => {
            game.increaseOxygenLevel(player, -1);
            game.log('${0} decreased oxygen level 1 step', (b) => b.player(player));
            return undefined;
          }));
        }

        // Decrease Venus scale option
        if (this.canDecrease(game, GlobalParameter.VENUS)) {
          orOptions.options.push(new SelectOption('Decrease Venus scale').andThen(() => {
            game.increaseVenusScaleLevel(player, -1);
            game.log('${0} decreased Venus scale level 1 step', (b) => b.player(player));
            return undefined;
          }));
        }

        if (this.canDecrease(game, GlobalParameter.MOON_HABITAT_RATE)) {
          orOptions.options.push(new SelectOption('Decrease Moon habitat rate').andThen(() => {
            MoonExpansion.lowerHabitatRate(player, 1);
            return undefined;
          }));
        }

        if (this.canDecrease(game, GlobalParameter.MOON_MINING_RATE)) {
          orOptions.options.push(new SelectOption('Decrease Moon mining rate').andThen(() => {
            MoonExpansion.lowerMiningRate(player, 1);
            return undefined;
          }));
        }

        if (this.canDecrease(game, GlobalParameter.MOON_LOGISTIC_RATE)) {
          orOptions.options.push(new SelectOption('Decrease Moon logistic rate').andThen(() => {
            MoonExpansion.lowerLogisticRate(player, 1);
            return undefined;
          }));
        }

        if (orOptions.options.length === 1) {
          return orOptions.options[0].cb();
        }

        player.defer(orOptions);
        return undefined;
      });

    return undefined;
  }
}

class RedsPolicy04 implements IPolicy {
  readonly id = 'rp04' as const;
  readonly description = 'When you raise a global parameter, decrease your M€ production 1 step per step raised if possible';
}

export const REDS_BONUS_1 = new RedsBonus01();
export const REDS_BONUS_2 = new RedsBonus02();
export const REDS_POLICY_1 = new RedsPolicy01();
export const REDS_POLICY_2 = new RedsPolicy02();
export const REDS_POLICY_3 = new RedsPolicy03();
export const REDS_POLICY_4 = new RedsPolicy04();
