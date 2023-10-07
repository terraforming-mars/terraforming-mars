import {IPlayer} from '../../IPlayer';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {CardRenderer} from '../render/CardRenderer';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../../turmoil/Turmoil';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';

export class ExecutiveOrder extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.EXECUTIVE_ORDER,

      metadata: {
        cardNumber: 'Y31',
        renderData: CardRenderer.builder((b) => {
          b.text('PLAY').globalEvent().asterix();
          b.br.br.br;
          b.delegates(2).megacredits(10).br.br;
        }),
        description: 'Draw 4 global events. Play 1 as the CURRENT GLOBAL EVENT and discard the rest. Place 2 delegates in any party. Gain 10 M€.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.stock.add(Resource.MEGACREDITS, 10, {log: true});
    const turmoil = Turmoil.getTurmoil(player.game);
    const globalEvents: IGlobalEvent[] = [];

    for (let i = 0; i < 4; i++) {
      const event = turmoil.globalEventDealer.draw();
      if (event !== undefined) {
        globalEvents.push(event);
      }
    }

    player.game.defer(new SimpleDeferredAction(player, () => {
      return new OrOptions(
        ...globalEvents.map((event) => {
          // TODO(kberg): Render as SelectGlobalEvent
          const description = event.name + ': ' + event.description + ' Neutral delegate added: ' + event.currentDelegate;
          return new SelectOption(description).andThen(() => {
            turmoil.currentGlobalEvent = event;
            turmoil.sendDelegateToParty('NEUTRAL', event.currentDelegate, player.game);

            globalEvents.forEach((ge) => {
              if (ge.name !== event.name) {
                turmoil.globalEventDealer.discardedGlobalEvents.push(ge);
              }
            });

            return undefined;
          });
        }),
      );
    }));

    // This gets played -- after -- drawing the global event, so don't turn it into Behavior yet.
    player.game.defer(new SendDelegateToArea(player, 'Select where to send 2 delegates', {count: 2}));
    return undefined;
  }
}
