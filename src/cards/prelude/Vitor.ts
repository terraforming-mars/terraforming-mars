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
    const game = player.game;

    // Awards are disabled for 1 player games
    if (game.isSoloMode()) return;

    const freeAward = new OrOptions();
    freeAward.title = 'Select award to fund';
    freeAward.buttonLabel = 'Confirm';

    // If Vitor isn't going first and someone else funds awards, filter them out.
    const availableAwards = game.awards.filter((award) => !game.fundedAwards.map((fa) => fa.award).includes(award));
    freeAward.options = availableAwards.map((award) => this.selectAwardToFund(player, award));

    return freeAward;
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    if (!player.isCorporation(this.name)) {
      return;
    }
    const victoryPoints = card.metadata.victoryPoints;
    if (victoryPoints === undefined) return;
    if (typeof(victoryPoints) === 'number') {
      if (victoryPoints <= 0) return;
    } else {
      // victoryPoints type is CardRenderDynamicVictoryPoints
      if (victoryPoints.points <= 0) return;
    }

    player.megaCredits += 3;
  }

  public play(_player: Player) {
    return undefined;
  }
}
