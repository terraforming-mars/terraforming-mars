import * as constants from '../../common/constants';
import {IProjectCard} from '../cards/IProjectCard';
import {GlobalParameter} from '../../common/GlobalParameter';
import {SelectOption} from '../inputs/SelectOption';
import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {Resource} from '../../common/Resource';
import {SpaceType} from '../../common/boards/SpaceType';
import {GREENS_POLICY_2, GREENS_POLICY_3} from './parties/Greens';
import {KELVINISTS_POLICY_4} from './parties/Kelvinists';
import {MARS_FIRST_POLICY_2} from './parties/MarsFirst';
import {PartyHooks} from './parties/PartyHooks';
import {PartyName} from '../../common/turmoil/PartyName';
import {REDS_POLICY_2} from './parties/Reds';
import {DynamicTRSource} from '../cards/ICard';
import {MoonExpansion} from '../moon/MoonExpansion';
import {TRSource} from '../../common/cards/TRSource';
import {Policy, policyDescription} from './Policy';

export class TurmoilHandler {
  private constructor() {}

  public static partyAction(player: IPlayer): PlayerInput | undefined {
    const turmoil = player.game.turmoil;
    if (turmoil === undefined) {
      return undefined;
    }
    const policy: Policy = turmoil.rulingPolicy();
    if (policy.canAct?.(player)) {
      return new SelectOption(policyDescription(policy, player), 'Pay').andThen(() => policy.action?.(player));
    }
    return undefined;
  }

  public static applyOnCardPlayedEffect(player: IPlayer, selectedCard: IProjectCard): void {
    // PoliticalAgendas Greens P3 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.GREENS, 'gp03')) {
      const policy = GREENS_POLICY_3;
      policy.onCardPlayed(player, selectedCard);
    }

    // PoliticalAgendas MarsFirst P2 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.MARS, 'mfp02')) {
      const policy = MARS_FIRST_POLICY_2;
      policy.onCardPlayed(player, selectedCard);
    }
  }

  public static resolveTilePlacementCosts(player: IPlayer): void {
    // PoliticalAgendas Reds P2 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS, 'rp02')) {
      const redsPolicy = REDS_POLICY_2;
      redsPolicy.onTilePlaced(player);
    }
  }

  public static resolveTilePlacementBonuses(player: IPlayer, spaceType: SpaceType): void {
    PartyHooks.applyMarsFirstRulingPolicy(player, spaceType);

    // PoliticalAgendas Greens P2 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.GREENS, 'gp02')) {
      const greensPolicy = GREENS_POLICY_2;
      greensPolicy.onTilePlaced(player);
    }

    // PoliticalAgendas Kelvinists P4 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.KELVINISTS, 'kp04')) {
      const kelvinistsPolicy = KELVINISTS_POLICY_4;
      kelvinistsPolicy.onTilePlaced(player);
    }
  }

  public static onGlobalParameterIncrease(player: IPlayer, parameter: GlobalParameter, steps: number = 1): void {
    if (parameter === GlobalParameter.TEMPERATURE) {
      // PoliticalAgendas Kelvinists P2 hook
      if (PartyHooks.shouldApplyPolicy(player, PartyName.KELVINISTS, 'kp02')) {
        player.stock.add(Resource.MEGACREDITS, steps * 3);
      }
    }

    // PoliticalAgendas Reds P4 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS, 'rp04')) {
      player.production.add(Resource.MEGACREDITS, -1 * steps, {log: true});
    }

    // PoliticalAgendas Scientists P3 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.SCIENTISTS, 'sp03')) {
      player.drawCard(steps);
    }
  }

  // TODO(kberg): Add a test where if you raise oxygen to max temperature but temperature is maxed you do not have to pay for it.
  // It works, but4 a test would be helpful.
  public static computeTerraformRatingBump(player: IPlayer, inputTr: TRSource | DynamicTRSource = {}): number {
    if (!PartyHooks.shouldApplyPolicy(player, PartyName.REDS, 'rp01')) return 0;

    let tr = inputTr instanceof Function ? inputTr(player) : inputTr;
    // Local copy
    tr = {...tr};
    let total = 0;

    if (tr.oxygen !== undefined) {
      const availableSteps = constants.MAX_OXYGEN_LEVEL - player.game.getOxygenLevel();
      const steps = Math.min(availableSteps, tr.oxygen);
      total = total + steps;
      // TODO(kberg): Add constants for these constraints.
      if (player.game.getOxygenLevel() < 8 && player.game.getOxygenLevel() + steps >= 8) {
        tr.temperature = (tr.temperature ?? 0) + 1;
      }
    }

    if (tr.temperature !== undefined) {
      const availableSteps = Math.floor((constants.MAX_TEMPERATURE - player.game.getTemperature()) / 2);
      const steps = Math.min(availableSteps, tr.temperature);
      total = total + steps;
      if (player.game.getTemperature() < 0 && player.game.getTemperature() + (steps * 2) >= 0) {
        tr.oceans = (tr.oceans ?? 0) + 1;
      }
    }

    if (tr.oceans !== undefined) {
      const availableSteps = constants.MAX_OCEAN_TILES - player.game.board.getOceanSpaces().length;
      const steps = Math.min(availableSteps, tr.oceans);
      total = total + steps;
    }

    if (tr.venus !== undefined) {
      const availableSteps = Math.floor((constants.MAX_VENUS_SCALE - player.game.getVenusScaleLevel()) / 2);
      const steps = Math.min(availableSteps, tr.venus);
      total = total + steps;
      if (player.game.getVenusScaleLevel() < 16 && player.game.getVenusScaleLevel() + (steps * 2) >= 16) {
        tr.tr = (tr.tr ?? 0) + 1;
      }
    }

    MoonExpansion.ifMoon(player.game, (moonData) => {
      if (tr.moonHabitat !== undefined) {
        const availableSteps = constants.MAXIMUM_HABITAT_RATE - moonData.habitatRate;
        total = total + Math.min(availableSteps, tr.moonHabitat);
      }

      if (tr.moonMining !== undefined) {
        const availableSteps = constants.MAXIMUM_MINING_RATE - moonData.miningRate;
        total = total + Math.min(availableSteps, tr.moonMining);
      }

      if (tr.moonLogistics !== undefined) {
        const availableSteps = constants.MAXIMUM_LOGISTICS_RATE - moonData.logisticRate;
        total = total + Math.min(availableSteps, tr.moonLogistics);
      }
    });

    total += tr.tr ?? 0;

    return total;
  }
}
