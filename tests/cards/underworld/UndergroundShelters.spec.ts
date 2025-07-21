import {expect} from 'chai';
import {UndergroundShelters} from '../../../src/server/cards/underworld/UndergroundShelters';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {assertIsExcavationAction} from '../../underworld/underworldAssertions';
import {ClaimedToken} from '../../../src/common/underworld/UnderworldPlayerData';
import {SelectClaimedUndergroundToken} from '../../../src/server/inputs/SelectClaimedUndergroundToken';

describe('UndergroundShelters', () => {
  it('Should play', () => {
    const card = new UndergroundShelters();
    const [game, player] = testGame(2, {underworldExpansion: true});

    cast(card.play(player), undefined);

    runAllActions(game);

    assertIsExcavationAction(player, player.popWaitingFor());

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });

  it('canAct', () => {
    const card = new UndergroundShelters();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});
    player.playedCards.push(card);

    expect(card.canAct(player)).to.be.false;

    const claimedToken: ClaimedToken = {token: 'nothing', active: false, shelter: false};
    player.underworldData.tokens.push(claimedToken);

    expect(card.canAct(player)).to.be.true;

    claimedToken.shelter = true;

    expect(card.canAct(player)).to.be.false;
  });

  it('action', () => {
    const card = new UndergroundShelters();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});
    player.playedCards.push(card);

    for (let index = 0; index < 3; index++) {
      player.underworldData.tokens.push({token: 'nothing', active: false, shelter: false});
    }

    const selectClaimedUndergroundToken = cast(card.action(player), SelectClaimedUndergroundToken);
    expect(selectClaimedUndergroundToken.tokens).to.have.lengthOf(3);

    selectClaimedUndergroundToken.cb([2]);

    expect(player.underworldData.tokens).deep.equal([
      {token: 'nothing', active: false, shelter: false},
      {token: 'nothing', active: false, shelter: false},
      {token: 'nothing', active: false, shelter: true}]);
  });

  it('VPs', () => {
    const card = new UndergroundShelters();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    for (let index = 0; index < 3; index++) {
      player.underworldData.tokens.push({token: 'nothing', active: false, shelter: false});
    }
    expect(card.getVictoryPoints(player)).to.equal(0);

    player.underworldData.tokens[0].shelter = true;
    expect(card.getVictoryPoints(player)).to.equal(1);

    player.underworldData.tokens[1].shelter = true;
    expect(card.getVictoryPoints(player)).to.equal(2);
  });
});
