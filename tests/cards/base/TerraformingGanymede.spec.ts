import {expect} from 'chai';
import {TerraformingGanymede} from '../../../src/server/cards/base/TerraformingGanymede';
import {Game} from '../../../src/server/Game';
import {Phase} from '../../../src/common/Phase';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';
import {TestPlayer} from '../../TestPlayer';
import {Reds} from '../../../src/server/turmoil/parties/Reds';
import {testGameOptions} from '../../TestingUtils';

describe('TerraformingGanymede', function() {
  let card: TerraformingGanymede;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new TerraformingGanymede();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player, testGameOptions({turmoilExtension: true}));
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getVictoryPoints()).to.eq(2);
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
    expect(player.canPlay(card)).is.true;

    player.tagsForTest = {jovian: 2};
    player.megaCredits = card.cost + 8;
    expect(player.canPlay(card)).is.not.true;
    player.megaCredits = card.cost + 9;
    expect(player.canPlay(card)).is.true;
  });
});
