import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CorporationCard} from './../corporation/CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {IAward} from '../../awards/IAward';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';

export class Vitor extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.VITOR,
      tags: [Tags.EARTH],
      startingMegaCredits: 48, // It's 45 + 3 when this corp is played
      initialActionText: 'Fund an award for free',

      metadata: {
        cardNumber: 'R35',
        description: 'You start with 45 M€. As your first action, fund an award for free.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(45).nbsp.award();
          b.corpBox('effect', (ce) => {
            ce.effect('When you play a card with a NON-NEGATIVE VP icon, including this, gain 3 M€.', (eb) => {
              eb.vpIcon().asterix().startEffect.megacredits(3);
            });
          });
        }),
      },
    });
  }

  private selectAwardToFund(player: Player, award: IAward): SelectOption {
    return new SelectOption('Fund ' + award.name + ' award', 'Confirm', () => {
      player.game.fundAward(player, award);
      return undefined;
    });
  }

  public initialAction(player: Player) {
    // Awards are disabled for 1 player games
    if (player.game.isSoloMode()) {
      return;
    }
    const freeAward = new OrOptions();
    freeAward.title = 'Select award to fund';
    freeAward.buttonLabel = 'Confirm';
    freeAward.options = player.game.awards.map((award) => this.selectAwardToFund(player, award));
    return freeAward;
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    if (player.isCorporation(this.name) && card.getVictoryPoints !== undefined && card.getVictoryPoints(player) >= 0) {
      player.megaCredits += 3;
    }
  }

  public play(_player: Player) {
    return undefined;
  }
}
