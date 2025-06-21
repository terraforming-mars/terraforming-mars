import {Phase} from '../../common/Phase';
import {IPlayer} from '../IPlayer';
import {Board} from '../boards/Board';
import {MoonExpansion} from '../moon/MoonExpansion';
import {PathfindersExpansion} from '../pathfinders/PathfindersExpansion';
import {Turmoil} from '../turmoil/Turmoil';
import {VictoryPointsBreakdownBuilder} from './VictoryPointsBreakdownBuilder';
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
  builder.setVictoryPoints('terraformRating', player.getTerraformRating());

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
      builder.setVictoryPoints('victoryPoints', turmoil.getPlayerVictoryPoints(player), 'Turmoil Points');
    }
  });

  const coloniesVP = player.colonies.getVictoryPoints();
  if (coloniesVP > 0) {
    builder.setVictoryPoints('victoryPoints', coloniesVP, 'Colony VP');
  }
  MoonExpansion.calculateVictoryPoints(player, builder);
  PathfindersExpansion.calculateVictoryPoints(player, builder);

  // Underworld Score Bribing
  if (player.game.gameOptions.underworldExpansion === true) {
    const bribe = Math.min(Math.abs(negativeVP), player.underworldData.corruption);
    builder.setVictoryPoints('victoryPoints', bribe, 'Underworld Corruption Bribe');
  }

  // Escape velocity VP penalty
  if (player.game.gameOptions.escapeVelocityMode) {
    const threshold = player.game.gameOptions.escapeVelocityThreshold;
    const bonusSecondsPerAction = player.game.gameOptions.escapeVelocityBonusSeconds;
    const period = player.game.gameOptions.escapeVelocityPeriod;
    const penaltyPerMin = player.game.gameOptions.escapeVelocityPenalty ?? 1;
    const elapsedTimeInMinutes = player.timer.getElapsedTimeInMinutes();
    if (threshold !== undefined && bonusSecondsPerAction !== undefined && period !== undefined && elapsedTimeInMinutes > threshold) {
      const overTimeInMinutes = Math.max(elapsedTimeInMinutes - threshold - (player.actionsTakenThisGame * (bonusSecondsPerAction / 60)), 0);
      const vpPenalty = penaltyPerMin * Math.floor(overTimeInMinutes / period);
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
  if (player.game.isSoloMode()) return;

  player.game.fundedAwards.forEach((fundedAward) => {
    const award = fundedAward.award;
    const scorer = new AwardScorer(player.game, award);
    const players: Array<IPlayer> = player.game.getPlayers().slice();
    players.sort((p1, p2) => scorer.get(p2) - scorer.get(p1));

    // There is one rank 1 player
    if (scorer.get(players[0]) > scorer.get(players[1])) {
      maybeSetVP(player, players[0], fundedAward, 5, '1st', builder);
      players.shift();

      if (players.length > 1) {
        // There is one rank 2 player
        if (scorer.get(players[0]) > scorer.get(players[1])) {
          maybeSetVP(player, players[0], fundedAward, 2, '2nd', builder);
        } else {
          // There are at least two rank 2 players
          const score = scorer.get(players[0]);
          while (players.length > 0 && scorer.get(players[0]) === score) {
            maybeSetVP(player, players[0], fundedAward, 2, '2nd', builder);
            players.shift();
          }
        }
      }
    } else {
      // There are at least two rank 1 players
      const score = scorer.get(players[0]);
      while (players.length > 0 && scorer.get(players[0]) === score) {
        maybeSetVP(player, players[0], fundedAward, 5, '1st', builder);
        players.shift();
      }
    }
  });
}
