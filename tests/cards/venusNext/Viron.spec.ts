import {expect} from 'chai';
import {RestrictedArea} from '../../../src/server/cards/base/RestrictedArea';
import {Viron} from '../../../src/server/cards/venusNext/Viron';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {cast} from '../../TestingUtils';

describe('Viron', function() {
  let card: Viron;
  let game: Game;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Viron();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Should act', function() {
    const action = card.play(player);

    expect(action).is.undefined;

    player.setCorporationForTest(card);
    const restrictedArea = new RestrictedArea();
    player.playedCards.push(restrictedArea);
    player.addActionThisGeneration(restrictedArea.name);

    expect(card.canAct(player)).is.not.true;

    player.megaCredits += 2;

    expect(card.canAct(player)).is.true;

    const selectCard = cast(card.action(player), SelectCard);
    expect(selectCard.cards).deep.eq([restrictedArea]);
  });

  it('Cannot act once Viron is used', function() {
    card.play(player);

    player.setCorporationForTest(card);
    const restrictedArea = new RestrictedArea();
    player.playedCards.push(restrictedArea);
    player.addActionThisGeneration(restrictedArea.name);
    player.addActionThisGeneration(card.name);
    player.megaCredits += 2;

    expect(card.canAct(player)).is.not.true;
  });
});
