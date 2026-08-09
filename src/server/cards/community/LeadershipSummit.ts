import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '../../turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRenderer} from '../render/CardRenderer';

export class LeadershipSummit extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.LEADERSHIP_SUMMIT,
      description: 'Draw 1 card for each party leader (max 5) and influence.',
      revealedDelegate: PartyName.GREENS,
      currentDelegate: PartyName.REDS,
      behavior: {
        drawCard: {count: {turmoil: {partyLeaders: {}, max: 5, influence: {}}}},
      },
      renderData: CardRenderer.builder((b) => {
        b.cards(1).slash().partyLeaders(1).plus().influence();
      }),
    });
  }
}
