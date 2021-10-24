import {expect} from 'chai';
import {TerraformingGanymede} from '../../../src/cards/base/TerraformingGanymede';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';
import {Phase} from '../../../src/Phase';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';
import {TestPlayer} from 'tests/TestPlayer';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {TestingUtils} from '../../TestingUtils';

describe('TerraformingGanymede', function() {
  let card: TerraformingGanymede;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new TerraformingGanymede();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player, TestingUtils.setCustomGameOptions());
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
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
