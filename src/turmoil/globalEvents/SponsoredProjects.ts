import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.cards(1).text('w/rsrs').colon().wild(1).br.cards(1).slash().influence();
});

export class SponsoredProjects implements IGlobalEvent {
    public name = GlobalEventName.SPONSORED_PROJECTS;
    public description = 'All cards with resources on them gain 1 resource. Draw 1 card for each influence.';
    public revealedDelegate = PartyName.SCIENTISTS;
    public currentDelegate = PartyName.GREENS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        player.getCardsWithResources().forEach((card) => card.resourceCount && player.addResourceTo(card));
        player.drawCard(turmoil.getPlayerInfluence(player));
      });
    }
    public renderData = RENDER_DATA;
}
