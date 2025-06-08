import {expect} from 'chai';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {GiantSolarShade} from '../../../src/server/cards/venusNext/GiantSolarShade';
import {IGame} from '../../../src/server/IGame';
import {Phase} from '../../../src/common/Phase';
import {Reds} from '../../../src/server/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';
import {TestPlayer} from '../../TestPlayer';
import {cast, testGame} from '../../TestingUtils';

describe('GiantSolarShade', () => {
  let card: GiantSolarShade;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new GiantSolarShade();
    [game, player/* , player2 */] = testGame(2, {venusNextExtension: true, turmoilExtension: true});
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
    expect(game.getVenusScaleLevel()).to.eq(6);
    expect(player.getTerraformRating()).to.eq(23);
  });

  it('Should play with Reds and Dirigibles', () => {
    player.game.phase = Phase.ACTION;
    player.game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);
    player.megaCredits = 27;

    expect(player.canPlay(card)).is.not.true;

    const dirigibles = new Dirigibles();
    player.playedCards.push(dirigibles);
    player.addResourceTo(dirigibles, 3);

    expect(player.canPlay(card)).deep.eq({redsCost: 9});
  });
});
