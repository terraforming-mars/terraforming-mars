import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {IPlayer} from '@/server/IPlayer';

export class SponsoredProjects extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SPONSORED_PROJECTS,
      description: 'All cards with resources on them gain 1 resource. Draw 1 card for each influence.',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.GREENS,
      behavior: {
        drawCard: {
          count: {turmoil: {influence: {}}},
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.cards(1, {secondaryTag: AltSecondaryTag.WILD_RESOURCE}).colon().wild(1).nbsp;
        b.cards(1).slash().influence();
      }),
    });
  }
  public override bespokeResolvePlayer(player: IPlayer) {
    player.getCardsWithResources().forEach((card) => card.resourceCount && player.addResourceTo(card));
  }
}
