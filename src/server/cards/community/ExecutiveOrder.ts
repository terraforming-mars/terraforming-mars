import {IPlayer} from '../../IPlayer';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {CardRenderer} from '../render/CardRenderer';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../../turmoil/Turmoil';
import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';
import {SelectGlobalEvent} from '../../inputs/SelectGlobalEvent';

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

    return new SelectGlobalEvent(globalEvents)
      .andThen((event) => {
        player.game.log('${0} selected Global Event ${1} for the current gflobal event', (b) => b.player(player).globalEvent(event));
        turmoil.currentGlobalEvent = event;
        turmoil.sendDelegateToParty('NEUTRAL', event.currentDelegate, player.game);
        player.game.log('Neutral delegate added to ${0}', (b) => b.partyName(event.currentDelegate));

        globalEvents.forEach((ge) => {
          if (ge.name !== event.name) {
            turmoil.globalEventDealer.discard(ge);
          }
        });

        player.game.defer(new SendDelegateToArea(player, 'Select where to send 2 delegates', {count: 2}));
        return undefined;
      });
  }
}
