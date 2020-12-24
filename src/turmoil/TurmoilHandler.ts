import {IProjectCard} from '../cards/IProjectCard';
import {Game} from '../Game';
import {SelectOption} from '../inputs/SelectOption';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {GreensPolicy03, GreensPolicy04} from './parties/Greens';
import {KelvinistsPolicy01} from './parties/Kelvinists';
import {MarsFirstPolicy02, MarsFirstPolicy04} from './parties/MarsFirst';
import {PartyHooks} from './parties/PartyHooks';
import {PartyName} from './parties/PartyName';
import {RedsPolicy03} from './parties/Reds';
import {ScientistsPolicy01} from './parties/Scientists';
import {UnityPolicy02, UnityPolicy03} from './parties/Unity';

export class TurmoilHandler {
  private constructor() {}

  public static addPlayerAction(player: Player, game: Game, options: PlayerInput[]): void {
    // Turmoil Scientists action
    if (PartyHooks.shouldApplyPolicy(game, PartyName.SCIENTISTS)) {
      const scientistsPolicy = new ScientistsPolicy01();

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
      const kelvinistsPolicy = new KelvinistsPolicy01();

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
    if (PartyHooks.shouldApplyPolicy(game, PartyName.GREENS, 'gp04')) {
      const greensPolicy = new GreensPolicy04();

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
    if (PartyHooks.shouldApplyPolicy(game, PartyName.MARS, 'mfp04')) {
      const marsFirstPolicy = new MarsFirstPolicy04();

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
    if (PartyHooks.shouldApplyPolicy(game, PartyName.UNITY, 'up02')) {
      const unityPolicy = new UnityPolicy02();

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
    if (PartyHooks.shouldApplyPolicy(game, PartyName.UNITY, 'up03')) {
      const unityPolicy = new UnityPolicy03();

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
    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS, 'rp03')) {
      const redsPolicy = new RedsPolicy03();

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
    if (PartyHooks.shouldApplyPolicy(game, PartyName.GREENS, 'gp03')) {
      const policy = new GreensPolicy03();
      policy.onCardPlayed(player, selectedCard);
    }

    // PoliticalAgendas MarsFirst P2 hook
    if (PartyHooks.shouldApplyPolicy(game, PartyName.MARS, 'mfp02')) {
      const policy = new MarsFirstPolicy02();
      policy.onCardPlayed(player, selectedCard);
    }
  }
}
