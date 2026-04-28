import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';
import {IPlayer} from '../../IPlayer';
import {SelectStandardProjectToPlay} from '../../inputs/SelectStandardProjectToPlay';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {Priority} from '../../deferredActions/Priority';
import {message} from '../../logs/MessageBuilder';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';

export class EstablishedMethods extends PreludeCard {
  constructor() {
    super({
      name: CardName.ESTABLISHED_METHODS,

      behavior: {
        stock: {megacredits: 30},
      },

      metadata: {
        cardNumber: 'X54',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(30).asterix();
          b.br;
          b.plainText('Gain 30 M€. Then pay for and perform 2 standard projects.');
          b.br;
          b.plainText('NOTE: If you cannot afford a second standard project, spend 10 M€ instead, or as much as possible.');
        }),
      },
    });
  }

  private askForStandardProject(player: IPlayer, first: boolean): void {
    const game = player.game;
    const standardProjects = game.getStandardProjects();
    const enabled = standardProjects.map((card) => card.canAct(player));

    if (first === false && !enabled.some(Boolean)) {
      const penalty = Math.min(10, player.spendableMegacredits());
      game.defer(new SelectPaymentDeferred(player, penalty, {
        title: message('Spend ${0} M€ instead of a second standard project', (b) => b.number(penalty)),
      }));
      return;
    }

    const title = first ? 'Select your first standard project' : 'Select your second standard project';
    player.defer(new SelectStandardProjectToPlay(player, standardProjects, {enabled, title, buttonLabel: 'Confirm'})
      .andThen(() => {
        if (first) {
          this.prepareForSecondStandardProject(player);
        }
        return undefined;
      }));
  }

  private prepareForSecondStandardProject(player: IPlayer) {
    player.game.defer(new SimpleDeferredAction(
      player,
      () => {
        this.askForStandardProject(player, false);
        return undefined;
      },
      Priority.BACK_OF_THE_LINE));
  }

  public override bespokePlay(player: IPlayer) {
    this.askForStandardProject(player, true);
    return undefined;
  }
}
