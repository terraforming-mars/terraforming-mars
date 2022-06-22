import {IProjectCard} from '../cards/IProjectCard';
import {GlobalParameter} from '../common/GlobalParameter';
import {SelectOption} from '../inputs/SelectOption';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {Resources} from '../common/Resources';
import {SpaceType} from '../common/boards/SpaceType';
import {GREENS_POLICY_2, GREENS_POLICY_3, GREENS_POLICY_4} from './parties/Greens';
import {KELVINISTS_POLICY_1, KELVINISTS_POLICY_3, KELVINISTS_POLICY_4} from './parties/Kelvinists';
import {MARS_FIRST_POLICY_2, MARS_FIRST_POLICY_4} from './parties/MarsFirst';
import {PartyHooks} from './parties/PartyHooks';
import {PartyName} from '../common/turmoil/PartyName';
import {REDS_POLICY_2, REDS_POLICY_3} from './parties/Reds';
import {SCIENTISTS_POLICY_1} from './parties/Scientists';
import {UNITY_POLICY_2, UNITY_POLICY_3} from './parties/Unity';
import * as constants from '../common/constants';
import {TRSource} from '../cards/ICard';
import {MoonExpansion} from '../moon/MoonExpansion';

export class TurmoilHandler {
  private constructor() {}

  public static addPlayerAction(player: Player, options: PlayerInput[]): void {
    // Turmoil Scientists action
    if (PartyHooks.shouldApplyPolicy(player, PartyName.SCIENTISTS)) {
      const scientistsPolicy = SCIENTISTS_POLICY_1;

      if (scientistsPolicy.canAct(player)) {
        options.push(
          new SelectOption(
            scientistsPolicy.description,
            'Pay',
            () => scientistsPolicy.action(player),
          ),
        );
      }
    }

    // Turmoil Kelvinists action
    if (PartyHooks.shouldApplyPolicy(player, PartyName.KELVINISTS)) {
      const kelvinistsPolicy = KELVINISTS_POLICY_1;

      if (kelvinistsPolicy.canAct(player)) {
        options.push(
          new SelectOption(
            kelvinistsPolicy.description(player),
            'Pay',
            () => kelvinistsPolicy.action(player),
          ),
        );
      }
    }

    // Turmoil Kelvinists action
    if (PartyHooks.shouldApplyPolicy(player, PartyName.KELVINISTS, 'kp03')) {
      const kelvinistsPolicy = KELVINISTS_POLICY_3;

      if (kelvinistsPolicy.canAct(player)) {
        options.push(
          new SelectOption(
            kelvinistsPolicy.description,
            'Pay',
            () => kelvinistsPolicy.action(player),
          ),
        );
      }
    }

    // Turmoil Greens action
    if (PartyHooks.shouldApplyPolicy(player, PartyName.GREENS, 'gp04')) {
      const greensPolicy = GREENS_POLICY_4;

      if (greensPolicy.canAct(player)) {
        options.push(
          new SelectOption(
            greensPolicy.description,
            'Pay',
            () => greensPolicy.action(player),
          ),
        );
      }
    }

    // Turmoil Mars First action
    if (PartyHooks.shouldApplyPolicy(player, PartyName.MARS, 'mfp04')) {
      const marsFirstPolicy = MARS_FIRST_POLICY_4;

      if (marsFirstPolicy.canAct(player)) {
        options.push(
          new SelectOption(
            marsFirstPolicy.description,
            'Pay',
            () => marsFirstPolicy.action(player),
          ),
        );
      }
    }

    // Turmoil Unity action
    if (PartyHooks.shouldApplyPolicy(player, PartyName.UNITY, 'up02')) {
      const unityPolicy = UNITY_POLICY_2;

      if (unityPolicy.canAct(player)) {
        options.push(
          new SelectOption(
            unityPolicy.description,
            'Pay',
            () => unityPolicy.action(player),
          ),
        );
      }
    }

    // Turmoil Unity action
    if (PartyHooks.shouldApplyPolicy(player, PartyName.UNITY, 'up03')) {
      const unityPolicy = UNITY_POLICY_3;

      if (unityPolicy.canAct(player)) {
        options.push(
          new SelectOption(
            unityPolicy.description,
            'Pay',
            () => unityPolicy.action(player),
          ),
        );
      }
    }

    // Turmoil Reds action
    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS, 'rp03')) {
      const redsPolicy = REDS_POLICY_3;

      if (redsPolicy.canAct(player)) {
        options.push(
          new SelectOption(
            redsPolicy.description,
            'Pay',
            () => redsPolicy.action(player),
          ),
        );
      }
    }
  }

  public static applyOnCardPlayedEffect(player: Player, selectedCard: IProjectCard): void {
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

  public static resolveTilePlacementCosts(player: Player): void {
    // PoliticalAgendas Reds P2 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS, 'rp02')) {
      const redsPolicy = REDS_POLICY_2;
      redsPolicy.onTilePlaced(player);
    }
  }

  public static resolveTilePlacementBonuses(player: Player, spaceType: SpaceType): void {
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

  public static onGlobalParameterIncrease(player: Player, parameter: GlobalParameter, steps: number = 1): void {
    if (parameter === GlobalParameter.TEMPERATURE) {
      // PoliticalAgendas Kelvinists P2 hook
      if (PartyHooks.shouldApplyPolicy(player, PartyName.KELVINISTS, 'kp02')) {
        player.addResource(Resources.MEGACREDITS, steps * 3);
      }
    }

    // PoliticalAgendas Reds P4 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS, 'rp04')) {
      player.addProduction(Resources.MEGACREDITS, -1 * steps, {log: true});
    }

    // PoliticalAgendas Scientists P3 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.SCIENTISTS, 'sp03')) {
      player.drawCard(steps);
    }
  }

  // TODO(kberg): Add a test where if you raise oxygen to max temperature but temperature is maxed you do not have to pay for it.
  // It works, but4 a test would be helpful.
  public static computeTerraformRatingBump(player: Player, tr: TRSource = {}): number {
    if (!PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) return 0;

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
      const availableSteps = constants.MAX_OCEAN_TILES - player.game.board.getOceanCount();
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
      if (tr.moonColony !== undefined) {
        const availableSteps = constants.MAXIMUM_COLONY_RATE - moonData.colonyRate;
        total = total + Math.min(availableSteps, tr.moonColony);
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
