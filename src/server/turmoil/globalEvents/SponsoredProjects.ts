import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.cards(1, {secondaryTag: AltSecondaryTag.WILD_RESOURCE}).colon().wild(1).nbsp;
  b.cards(1).slash().influence();
});

export class SponsoredProjects extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SPONSORED_PROJECTS,
      description: 'All cards with resources on them gain 1 resource. Draw 1 card for each influence.',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.GREENS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.getCardsWithResources().forEach((card) => card.resourceCount && player.addResourceTo(card));
      player.drawCard(turmoil.getPlayerInfluence(player));
    });
  }
}
