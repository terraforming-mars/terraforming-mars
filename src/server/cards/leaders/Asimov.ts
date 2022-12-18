import { CardName } from '../../../common/cards/CardName';
import { CardType } from '../../../common/cards/CardType';
import { Player } from '../../Player';
import { PlayerInput } from '../../PlayerInput';
import { Card } from '../Card';
import { CardRenderer } from '../render/CardRenderer';
import { LeaderCard } from './LeaderCard';


import {IAward} from '../../awards/IAward';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Size} from '../../../common/cards/render/Size';
import {Dealer} from '../../Dealer';
//newOpsExpansion import {ALL_AWARDS, AMAZONIS_PLANITIA_AWARDS, ARABIA_TERRA_AWARDS, TERRA_CIMMERIA_AWARDS, VASTITAS_BOREALIS_AWARDS} from '../../awards/Awards';
import {ALL_AWARDS} from '../../awards/Awards';

export class Asimov extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.ASIMOV,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L01',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.award().nbsp.colon().text('+2', Size.LARGE);
          b.br.br.br;
          b.opgArrow().text('10-X').award().asterix();
        }),
        description: 'You have +2 score for all awards. Once per game, draw 10-X awards (min. 1), where X is the current generation number. You may put one into the game and fund it for free.',
      },
    });
  }

  public isDisabled = false;

  // public play() {
  override play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    return !player.game.allAwardsFunded() && this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    const awardCount = Math.max(1, 10 - game.generation);
    let availableAwards = ALL_AWARDS.filter((award) => {
      if (game.awards.includes(award)) return false;
      if (!game.gameOptions.venusNextExtension && award.name === 'Venuphile') return false;
      if (!game.gameOptions.turmoilExtension && award.name === 'Politician') return false;
      if (!game.gameOptions.aresExtension && award.name === 'Entrepreneur') return false;
      if (!game.gameOptions.moonExpansion && award.name === 'Full Moon') return false;
      if (!game.gameOptions.moonExpansion && award.name === 'Lunar Magnate') return false;

      //newOpsExpansion If newOpsExpansion is ever added, this can be incorporated
      //newOpsExpansion if (!game.gameOptions.newOpsExpansion) {
      //newOpsExpansion   const fanAwards = [...AMAZONIS_PLANITIA_AWARDS, ...ARABIA_TERRA_AWARDS, ...TERRA_CIMMERIA_AWARDS, ...VASTITAS_BOREALIS_AWARDS];
      //newOpsExpansion   if (fanAwards.includes(award)) return false;
      //newOpsExpansion }

      return true;
    })

    const freeAward = new OrOptions();
    freeAward.title = 'Select award to put into play and fund';
    freeAward.buttonLabel = 'Confirm';

    availableAwards = Dealer.shuffle(availableAwards);
    freeAward.options = availableAwards.slice(0, awardCount).map((award) => this.selectAwardToFund(player, award));
    freeAward.options.push(
      new SelectOption('Do nothing', 'Confirm', () => {
        game.log('${0} chose not to fund any award', (b) => b.player(player));
        this.isDisabled = true;
        return undefined;
      })
    );

    return freeAward;
  }

  private selectAwardToFund(player: Player, award: IAward): SelectOption {
    // Get the players and store them in a non-read-only array:
    let players = [...player.game.getPlayers()];
    // Sort the players by score:
    let title = 'Fund ' + award.name + ' award' + ' [';
    title += players
      .sort((a, b) => award.getScore(b) - award.getScore(a))
      .map((player) => player.name + ': ' + award.getScore(player))
      .join(' / ');
    title +=  ']';

    return new SelectOption(title, 'Confirm', () => {
      player.game.awards.push(award);
      player.game.fundAward(player, award);
      this.isDisabled = true;
      return undefined;
    });
  }
}
