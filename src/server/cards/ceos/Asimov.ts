import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {inplaceShuffle} from '../../utils/shuffle';
import {UnseededRandom} from '../../../common/utils/Random';

import {IAward} from '../../awards/IAward';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Size} from '../../../common/cards/render/Size';

import {ALL_AWARDS} from '../../awards/Awards';
import {AwardScorer} from '../../awards/AwardScorer';
import {message} from '../../logs/MessageBuilder';
import {AWARD_COMPATIBILITY} from '../../../common/ma/compatibilities';

export class Asimov extends CeoCard {
  constructor() {
    super({
      name: CardName.ASIMOV,
      metadata: {
        cardNumber: 'L01',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.effect('You have +2 score for all awards.', (eb) => {
            eb.award().startEffect.text('+2', Size.LARGE);
          });
          b.br.br.br;
          b.opgArrow().text('10-X').award().asterix();
        }),
        description: 'Once per game, draw 10-X awards (min. 1), where X is the current generation number. You may put one into the game and fund it for free.',
      },
    });
  }

  public override canAct(player: IPlayer): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    if (player.game.isSoloMode()) return false; // Awards are disabled in solo mode
    return !player.game.allAwardsFunded();
  }

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    const game = player.game;
    const awardCount = Math.max(1, 10 - game.generation);
    const validAwards = this.getValidAwards(player);
    inplaceShuffle(validAwards, UnseededRandom.INSTANCE);

    const freeAward = new OrOptions();
    freeAward.title = 'Select award to put into play and fund';
    freeAward.buttonLabel = 'Confirm';

    freeAward.options = validAwards.slice(0, awardCount).map((award) => this.selectAwardToFund(player, award));
    freeAward.options.push(
      new SelectOption('Do nothing').andThen(() => {
        game.log('${0} chose not to fund any award', (b) => b.player(player));
        return undefined;
      }),
    );

    return freeAward;
  }

  private selectAwardToFund(player: IPlayer, award: IAward): SelectOption {
    const game = player.game;
    const scorer = new AwardScorer(game, award);
    // Sort the players by score:
    const players: Array<IPlayer> = game.getPlayers().slice();
    players.sort((p1, p2) => scorer.get(p2) - scorer.get(p1));
    const title = message('Fund ${0} award [${1}]', (b) => b.award(award).string(
      players.map((player) => player.name + ': ' + scorer.get(player)).join(' / ')));

    return new SelectOption(title).andThen(() => {
      player.game.awards.push(award);
      player.game.fundAward(player, award);
      return undefined;
    });
  }

  private getValidAwards(player: IPlayer): Array<IAward> {
    // NB: This makes no effort to maintain Award synergy.
    const gameOptions = player.game.gameOptions;
    const validAwards = ALL_AWARDS.filter((award) => {
      // TODO(kberg): Centralize this so this card doesn't have to be updated.

      // Remove awards already in the game
      if (player.game.awards.includes(award)) return false;
      // Remove awards that require unused variants/expansions
      switch (AWARD_COMPATIBILITY[award.name].compatibility) {
      case 'venus': return gameOptions.venusNextExtension;
      case 'colonies': return gameOptions.coloniesExtension;
      case 'turmoil': return gameOptions.turmoilExtension;
      case 'ares': return gameOptions.aresExtension;
      case 'moon': return gameOptions.moonExpansion;
      case 'underworld': return gameOptions.underworldExpansion;
      }

      return true;
    });
    if (validAwards.length === 0) throw new Error('getValidAwards award list is empty.');
    return validAwards;
  }
}
