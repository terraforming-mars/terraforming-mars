import {Phase} from '../../common/Phase';
import {IPlayer} from '../IPlayer';
import {Board} from '../boards/Board';
import {MoonExpansion} from '../moon/MoonExpansion';
import {PathfindersExpansion} from '../pathfinders/PathfindersExpansion';
import {DeltaProjectExpansion} from '../delta/DeltaProjectExpansion';
import {Turmoil} from '../turmoil/Turmoil';
import {VictoryPointsBreakdownBuilder} from './VictoryPointsBreakdownBuilder';
import {rankedTiers} from '../../common/utils/utils';
import {FundedAward} from '../awards/FundedAward';
import {AwardScorer} from '../awards/AwardScorer';
import {CardName} from '../../common/cards/CardName';

export function calculateVictoryPoints(player: IPlayer) {
  const builder = new VictoryPointsBreakdownBuilder();

  // Victory points from cards
  let playerOwnsVermin = false; // For Vermin
  let negativeVP = 0; // For Underworld.
  for (const playedCard of player.tableau) {
    if (playedCard.victoryPoints !== undefined) {
      const vp = playedCard.getVictoryPoints(player);
      builder.setVictoryPoints('victoryPoints', vp, playedCard.name);
      if (vp < 0) {
        negativeVP += vp;
      }
    }
    playerOwnsVermin ||= playedCard.name === CardName.VERMIN;
  }

  // Apply the Vermin penalty to other players. Vermin owner is penalized by the card itself.
  if (player.game.verminInEffect && playerOwnsVermin === false) {
    const cities = player.game.board.getCities(player).length;
    builder.setVictoryPoints('victoryPoints', cities * -1, CardName.VERMIN);
    negativeVP -= cities;
  }

  // Victory points from TR
  builder.setVictoryPoints('terraformRating', player.terraformRating);

  // Victory points from awards
  giveAwards(player, builder);

  // Victory points from milestones
  for (const milestone of player.game.claimedMilestones) {
    if (milestone.player !== undefined && milestone.player.id === player.id) {
      builder.setVictoryPoints('milestones', 5, 'Claimed ${0} milestone', [milestone.milestone.name]);
    }
  }

  // Victory points from board
  player.game.board.spaces.forEach((space) => {
    // Victory points for greenery tiles
    if (Board.isGreenerySpace(space) && Board.spaceOwnedBy(space, player)) {
      builder.setVictoryPoints('greenery', 1);
    }

    // Victory points for greenery tiles adjacent to cities
    if (Board.isCitySpace(space) && Board.spaceOwnedBy(space, player)) {
      const adjacent = player.game.board.getAdjacentSpaces(space);
      for (const adj of adjacent) {
        if (Board.isGreenerySpace(adj)) {
          builder.setVictoryPoints('city', 1);
        }
      }
    }
  });

  // Turmoil Victory Points
  const includeTurmoilVP = player.game.gameIsOver() || player.game.phase === Phase.END;

  Turmoil.ifTurmoil(player.game, (turmoil) => {
    if (includeTurmoilVP) {
      builder.setVictoryPoints('victoryPoints', turmoil.getVictoryPoints(player), 'Turmoil Points');
    }
  });

  const coloniesVP = player.colonies.getVictoryPoints();
  if (coloniesVP > 0) {
    builder.setVictoryPoints('victoryPoints', coloniesVP, 'Colony VP');
  }
  MoonExpansion.calculateVictoryPoints(player, builder);
  PathfindersExpansion.calculateVictoryPoints(player, builder);
  DeltaProjectExpansion.calculateVictoryPoints(player, builder);

  // Underworld Score Bribing
  if (player.game.gameOptions.underworldExpansion === true) {
    const bribe = Math.min(Math.abs(negativeVP), player.underworldData.corruption);
    builder.setVictoryPoints('victoryPoints', bribe, 'Underworld Corruption Bribe');
  }

  // Escape velocity VP penalty
  if (player.game.gameOptions.escapeVelocity !== undefined) {
    const options = player.game.gameOptions.escapeVelocity;

    const elapsedTimeMinutes = player.timer.getElapsedTimeInMinutes();
    const bonusActionMinutes = player.actionsTakenThisGame * (options.bonusSectionsPerAction / 60);
    const overageMin = elapsedTimeMinutes - bonusActionMinutes - options.thresholdMinutes;

    if (overageMin > 0) {
      const vpPenalty = options.penaltyVPPerPeriod * Math.floor(overageMin / options.penaltyPeriodMinutes);
      builder.setVictoryPoints('escapeVelocity', -vpPenalty);
    }
  }

  return builder.build();
}

function maybeSetVP(thisPlayer: IPlayer, awardWinner: IPlayer, fundedAward: FundedAward, vps: number, place: '1st' | '2nd', builder: VictoryPointsBreakdownBuilder) {
  if (thisPlayer.id === awardWinner.id) {
    builder.setVictoryPoints(
      'awards',
      vps,
      '${0} place for ${1} award (funded by ${2})',
      [place, fundedAward.award.name, fundedAward.player.name],
    );
  }
}

function giveAwards(player: IPlayer, builder: VictoryPointsBreakdownBuilder) {
  // Awards are disabled for 1 player games
  if (player.game.isSoloMode()) {
    return;
  }

  player.game.fundedAwards.forEach((fundedAward) => {
    const award = fundedAward.award;
    const scorer = new AwardScorer(player.game, award);
    const players = player.game.players;
    const [first, second] = rankedTiers(players, (p) => scorer.get(p));

    if (first.items.length === 1) {
      maybeSetVP(player, first.items[0], fundedAward, 5, '1st', builder);
      // Second place is not awarded in 2 player games.
      if (players.length > 2 && second !== undefined) {
        for (const p of second.items) {
          maybeSetVP(player, p, fundedAward, 2, '2nd', builder);
        }
      }
    } else {
      // A tie for first place is friendly, and takes the second place award with it.
      for (const p of first.items) {
        maybeSetVP(player, p, fundedAward, 5, '1st', builder);
      }
    }
  });
}
