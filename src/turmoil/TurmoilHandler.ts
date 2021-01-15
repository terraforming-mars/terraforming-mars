import {ISpace} from '../boards/ISpace';
import {IProjectCard} from '../cards/IProjectCard';
import {Game} from '../Game';
import {GlobalParameter} from '../GlobalParameter';
import {SelectOption} from '../inputs/SelectOption';
import {Phase} from '../Phase';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {Resources} from '../Resources';
import {SpaceType} from '../SpaceType';
import {GREENS_POLICY_2, GREENS_POLICY_3, GREENS_POLICY_4} from './parties/Greens';
import {KELVINISTS_POLICY_1, KELVINISTS_POLICY_3, KELVINISTS_POLICY_4} from './parties/Kelvinists';
import {MARS_FIRST_POLICY_2, MARS_FIRST_POLICY_4} from './parties/MarsFirst';
import {PartyHooks} from './parties/PartyHooks';
import {PartyName} from './parties/PartyName';
import {REDS_POLICY_2, REDS_POLICY_3} from './parties/Reds';
import {SCIENTISTS_POLICY_1} from './parties/Scientists';
import {UNITY_POLICY_2, UNITY_POLICY_3} from './parties/Unity';
import {TurmoilPolicy} from './TurmoilPolicy';

export class TurmoilHandler {
  private constructor() {}

  public static addPlayerAction(player: Player, game: Game, options: PlayerInput[]): void {
    // Turmoil Scientists action
    if (PartyHooks.shouldApplyPolicy(game, PartyName.SCIENTISTS)) {
      const scientistsPolicy = SCIENTISTS_POLICY_1;

      if (scientistsPolicy.canAct(player)) {
        options.push(
          new SelectOption(
            scientistsPolicy.description,
            'Pay',
            () => scientistsPolicy.action(player, game),
          ),
        );
      }
    }

    // Turmoil Kelvinists action
    if (PartyHooks.shouldApplyPolicy(game, PartyName.KELVINISTS)) {
      const kelvinistsPolicy = KELVINISTS_POLICY_1;

      if (kelvinistsPolicy.canAct(player)) {
        options.push(
          new SelectOption(
            kelvinistsPolicy.description,
            'Pay',
            () => kelvinistsPolicy.action(player, game),
          ),
        );
      }
    }

    // Turmoil Kelvinists action
    if (PartyHooks.shouldApplyPolicy(game, PartyName.KELVINISTS, 'kp03')) {
      const kelvinistsPolicy = KELVINISTS_POLICY_3;

      if (kelvinistsPolicy.canAct(player)) {
        options.push(
          new SelectOption(
            kelvinistsPolicy.description,
            'Pay',
            () => kelvinistsPolicy.action(player, game),
          ),
        );
      }
    }

    // Turmoil Greens action
    if (PartyHooks.shouldApplyPolicy(game, PartyName.GREENS, TurmoilPolicy.GREENS_POLICY_4)) {
      const greensPolicy = GREENS_POLICY_4;

      if (greensPolicy.canAct(player)) {
        options.push(
          new SelectOption(
            greensPolicy.description,
            'Pay',
            () => greensPolicy.action(player, game),
          ),
        );
      }
    }

    // Turmoil Mars First action
    if (PartyHooks.shouldApplyPolicy(game, PartyName.MARS, TurmoilPolicy.MARS_FIRST_POLICY_4)) {
      const marsFirstPolicy = MARS_FIRST_POLICY_4;

      if (marsFirstPolicy.canAct(player)) {
        options.push(
          new SelectOption(
            marsFirstPolicy.description,
            'Pay',
            () => marsFirstPolicy.action(player, game),
          ),
        );
      }
    }

    // Turmoil Unity action
    if (PartyHooks.shouldApplyPolicy(game, PartyName.UNITY, TurmoilPolicy.UNITY_POLICY_2)) {
      const unityPolicy = UNITY_POLICY_2;

      if (unityPolicy.canAct(player)) {
        options.push(
          new SelectOption(
            unityPolicy.description,
            'Pay',
            () => unityPolicy.action(player, game),
          ),
        );
      }
    }

    // Turmoil Unity action
    if (PartyHooks.shouldApplyPolicy(game, PartyName.UNITY, TurmoilPolicy.UNITY_POLICY_3)) {
      const unityPolicy = UNITY_POLICY_3;

      if (unityPolicy.canAct(player)) {
        options.push(
          new SelectOption(
            unityPolicy.description,
            'Pay',
            () => unityPolicy.action(player, game),
          ),
        );
      }
    }

    // Turmoil Reds action
    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS, TurmoilPolicy.REDS_POLICY_3)) {
      const redsPolicy = REDS_POLICY_3;

      if (redsPolicy.canAct(player, game)) {
        options.push(
          new SelectOption(
            redsPolicy.description,
            'Pay',
            () => redsPolicy.action(player, game),
          ),
        );
      }
    }
  }

  public static applyOnCardPlayedEffect(player: Player, game: Game, selectedCard: IProjectCard): void {
    // PoliticalAgendas Greens P3 hook
    if (PartyHooks.shouldApplyPolicy(game, PartyName.GREENS, TurmoilPolicy.GREENS_POLICY_3)) {
      const policy = GREENS_POLICY_3;
      policy.onCardPlayed(player, selectedCard);
    }

    // PoliticalAgendas MarsFirst P2 hook
    if (PartyHooks.shouldApplyPolicy(game, PartyName.MARS, TurmoilPolicy.MARS_FIRST_POLICY_2)) {
      const policy = MARS_FIRST_POLICY_2;
      policy.onCardPlayed(player, selectedCard);
    }
  }

  public static resolveTilePlacementCosts(game: Game, player: Player, space: ISpace): void {
    // PoliticalAgendas Reds P2 hook
    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS, TurmoilPolicy.REDS_POLICY_2) && game.phase === Phase.ACTION) {
      const redsPolicy = REDS_POLICY_2;
      redsPolicy.onTilePlaced(player, space, game);
    }
  }

  public static resolveTilePlacementBonuses(game: Game, player: Player, spaceType: SpaceType): void {
    PartyHooks.applyMarsFirstRulingPolicy(game, player, spaceType);

    // PoliticalAgendas Greens P2 hook
    if (PartyHooks.shouldApplyPolicy(game, PartyName.GREENS, TurmoilPolicy.GREENS_POLICY_2) && game.phase === Phase.ACTION) {
      const greensPolicy = GREENS_POLICY_2;
      greensPolicy.onTilePlaced(player);
    }

    // PoliticalAgendas Kelvinists P4 hook
    if (PartyHooks.shouldApplyPolicy(game, PartyName.KELVINISTS, TurmoilPolicy.KELVINISTS_POLICY_4) && game.phase === Phase.ACTION) {
      const kelvinistsPolicy = KELVINISTS_POLICY_4;
      kelvinistsPolicy.onTilePlaced(player);
    }
  }

  public static onGlobalParameterIncrease(game: Game, player: Player, parameter: GlobalParameter, steps: number = 1): void {
    if (parameter === GlobalParameter.TEMPERATURE) {
      // PoliticalAgendas Kelvinists P2 hook
      if (PartyHooks.shouldApplyPolicy(game, PartyName.KELVINISTS, TurmoilPolicy.KELVINISTS_POLICY_2)) {
        player.setResource(Resources.MEGACREDITS, steps * 3);
      }
    }

    // PoliticalAgendas Reds P4 hook
    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS, TurmoilPolicy.REDS_POLICY_4)) {
      player.addProduction(Resources.MEGACREDITS, -1 * steps);
    }

    // PoliticalAgendas Scientists P3 hook
    if (PartyHooks.shouldApplyPolicy(game, PartyName.SCIENTISTS, TurmoilPolicy.SCIENTISTS_POLICY_3)) {
      player.drawCard(steps);
    }
  }
}
