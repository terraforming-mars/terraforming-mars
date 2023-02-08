import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {MAX_COLONY_TRACK_POSITION} from '../../../common/constants';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';

export class Naomi extends CeoCard {
  constructor() {
    super({
      name: CardName.NAOMI,
      metadata: {
        cardNumber: 'L14',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.colonies(1).colon().energy(2).megacredits(2);
          b.br.br.br;
          b.opgArrow().text('SET ALL').colonies(1).asterix();
        }),
        description: 'When you build a colony, gain 2 energy and 2 M€. Once per game, move each colony tile track marker to its highest or lowest value.',
      },
    });
  }

  public override canAct(player: Player): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    const openColonies = player.game.colonies.filter((colony) => colony.isActive && colony.visitor === undefined);
    return openColonies.length > 0;
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    const activeColonies = game.colonies.filter((colony) => colony.isActive);

    activeColonies.forEach((colony) => {
      game.defer(new SimpleDeferredAction(player, () => new OrOptions(
        new SelectOption('Increase ' + colony.name + ' track to its highest value', 'Select', () => {
          colony.trackPosition = MAX_COLONY_TRACK_POSITION;
          return undefined;
        }),
        new SelectOption('Decrease ' + colony.name + ' track to its lowest value', 'Select', () => {
          colony.trackPosition = colony.colonies.length;
          return undefined;
        }),
      )));
    });
    this.isDisabled = true;
    return undefined;
  }
}
