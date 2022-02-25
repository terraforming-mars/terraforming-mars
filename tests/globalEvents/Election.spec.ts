import {expect} from 'chai';
import {StripMine} from '../../src/cards/base/StripMine';
import {Election} from '../../src/turmoil/globalEvents/Election';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {getTestPlayer, newTestGame} from '../TestGame';
import {TestingUtils} from '../TestingUtils';
import {Tags} from '../../src/common/cards/Tags';

describe('Election', function() {
  let card: Election;
  beforeEach(() => {
    card = new Election();
  });
  it('resolve play', function() {
    const game = newTestGame(3, {turmoilExtension: true});
    const player = getTestPlayer(game, 0);
    const player2 = getTestPlayer(game, 1);
    const player3 = getTestPlayer(game, 2);
    const turmoil = game.turmoil!;
    turmoil.initGlobalEvent(game);
    player.playedCards.push(new StripMine());
    player2.playedCards.push(new StripMine());
    player2.playedCards.push(new StripMine());
    game.addCityTile(player3, game.board.getAvailableSpacesOnLand(player3)[0].id);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);

    expect(card.getScore(player, turmoil, game)).eq(1);
    expect(card.getScore(player2, turmoil, game)).eq(4);
    expect(card.getScore(player3, turmoil, game)).eq(1);

    card.resolve(game, turmoil);

    expect(player.getTerraformRating()).to.eq(21);
    expect(player2.getTerraformRating()).to.eq(22);
    expect(player3.getTerraformRating()).to.eq(21);
  });


  it('solo play', function() {
    const game = newTestGame(1, {turmoilExtension: true});
    const player = getTestPlayer(game, 0);
    const turmoil = game.turmoil!;
    turmoil.initGlobalEvent(game);
    const fakeCard = TestingUtils.fakeCard({tags: [Tags.BUILDING, Tags.BUILDING, Tags.BUILDING, Tags.BUILDING]});
    player.playedCards.push(fakeCard);

    expect(player.getTerraformRating()).to.eq(14);
    expect(card.getScore(player, turmoil, game)).eq(4);

    card.resolve(game, turmoil);

    expect(player.getTerraformRating()).to.eq(14);

    fakeCard.tags.push(Tags.BUILDING);
    expect(card.getScore(player, turmoil, game)).eq(5);

    card.resolve(game, turmoil);

    expect(player.getTerraformRating()).to.eq(15);

    fakeCard.tags.push(Tags.BUILDING, Tags.BUILDING, Tags.BUILDING, Tags.BUILDING);
    expect(card.getScore(player, turmoil, game)).eq(9);

    card.resolve(game, turmoil);

    expect(player.getTerraformRating()).to.eq(16);

    fakeCard.tags.push(Tags.BUILDING);
    expect(card.getScore(player, turmoil, game)).eq(10);

    card.resolve(game, turmoil);

    expect(player.getTerraformRating()).to.eq(18);
  });
});
