import {expect} from 'chai';
import {TerraformingGanymede} from '../../../src/server/cards/base/TerraformingGanymede';
import {IGame} from '../../../src/server/IGame';
import {Phase} from '../../../src/common/Phase';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';
import {TestPlayer} from '../../TestPlayer';
import {Reds} from '../../../src/server/turmoil/parties/Reds';
import {cast, testGame} from '../../TestingUtils';

describe('TerraformingGanymede', function() {
  let card: TerraformingGanymede;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new TerraformingGanymede();
    [game, player/* , player2 */] = testGame(2, {turmoilExtension: true});
  });

  it('Should play', function() {
    cast(card.play(player), undefined);
    expect(card.getVictoryPoints(player)).to.eq(2);
    player.playedCards.push(card);
    expect(player.getTerraformRating()).to.eq(21);
  });

  it('canPlay with Reds', () => {
    player.game.phase = Phase.ACTION;
    player.game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.not.true;
    player.megaCredits = card.cost + 3;
    expect(player.canPlay(card)).deep.eq({redsCost: 3});

    player.tagsForTest = {jovian: 2};
    player.megaCredits = card.cost + 8;
    expect(player.canPlay(card)).is.not.true;
    player.megaCredits = card.cost + 9;
    expect(player.canPlay(card)).deep.eq({redsCost: 9});
  });
});
