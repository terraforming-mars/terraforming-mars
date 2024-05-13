import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {MarsFrontierAlliance} from '../../../src/server/cards/pathfinders/MarsFrontierAlliance';
import {cast, startGenerationEnd} from '../../TestingUtils';
import {IPlayer} from '../../../src/server/IPlayer';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {SelectPolicyBonus} from '../../../src/server/inputs/SelectPolicyBonus';

describe('MarsFrontierAlliance', function() {
  let card: MarsFrontierAlliance;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new MarsFrontierAlliance();
  });

  it('New generation - switch of allied party', function() {
    const [game, player] = testGame(1, {
      pathfindersExpansion: true,
      turmoilExtension: true,
    });
    player.setCorporationForTest(card);
    game.generation = 10;
    turmoil = game.turmoil!;

    const reds = game.turmoil!.getPartyByName(PartyName.REDS);
    const unity = game.turmoil!.getPartyByName(PartyName.UNITY);

    turmoil.sendDelegateToParty(player, reds.name, game);
    turmoil.sendDelegateToParty(player, reds.name, game);
    turmoil.sendDelegateToParty(player, reds.name, game);
    turmoil.sendDelegateToParty(player, unity.name, game);
    turmoil.sendDelegateToParty(player, unity.name, game);

    player.pathfindersData!.alliedParty! = {
      name: reds.name,
      bonus: reds.bonuses[0].id,
      policy: reds.policies[0].id,
    };

    startGenerationEnd(game);
    const selectBonus: SelectPolicyBonus = getWaitingFor(player);
    expect(selectBonus.bonuses.length).to.eq(2);
    selectBonus.process({type: 'bonus', bonusId: unity.bonuses[0].id});
    // expect(game.getGeneration()).to.eq(11);
    expect(game.turmoil!.rulingParty).to.eq(reds);
    expect(player.pathfindersData.alliedParty.name).to.eq(unity.name);
  });

/*
  it('play - 2 player - draft', function() {
    const [game, player, player2] = testGame(2, {
      pathfindersExpansion: true,
      draftVariant: true,
      turmoilExtension: false,
    });
    player.setCorporationForTest(card);
    game.generation = 10;

    // End the generation. Player will draw 5 cards
    finishGeneration(game);
    expect(game.getGeneration()).to.eq(11);

    expect(getWaitingFor(player).cards).has.length(5);
    expect(getWaitingFor(player).config.min).eq(2);
    expect(getWaitingFor(player).config.max).eq(2);
    expect(getWaitingFor(player2).cards).has.length(4);
  });

  it('play - 2 player - no draft', function() {
    const [game, player, player2] = testGame(2, {
      pathfindersExpansion: true,
      draftVariant: false,
      turmoilExtension: false,
    });
    player.setCorporationForTest(card);
    game.generation = 10;

    player.playedCards = [card];

    // End the generation. Player will draw 5 cards
    finishGeneration(game);
    expect(game.getGeneration()).to.eq(11);

    expect(getWaitingFor(player).cards).has.length(5);
    expect(getWaitingFor(player).config.min).eq(0);
    expect(getWaitingFor(player).config.max).eq(4);
    expect(getWaitingFor(player2).cards).has.length(4);
  });*/
});

function getWaitingFor(player: IPlayer): SelectPolicyBonus {
  return cast(player.getWaitingFor(), SelectPolicyBonus);
}
