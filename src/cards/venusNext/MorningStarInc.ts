import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class MorningStarInc implements CorporationCard {
    public name = CardName.MORNING_STAR_INC;
    public tags = [Tags.VENUS];
    public startingMegaCredits: number = 50;
    public cardType = CardType.CORPORATION;

    public initialActionText: string = 'Draw 3 Venus-tag cards';
    public initialAction(player: Player) {
      player.drawCard(3, {tag: Tags.VENUS});
      return undefined;
    }

    public getRequirementBonus(_player: Player, parameter: GlobalParameter): number {
      return parameter === GlobalParameter.VENUS ? 2 : 0;
    }

    public play() {
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'R06',
      description: 'You start with 50 MC. As your first action, reveal cards from the deck until you have revealed 3 Venus-tag cards. Take those into hand and discard the rest.',
      renderData: CardRenderer.builder((b) => {
        b.megacredits(50).nbsp.cards(3).secondaryTag(Tags.VENUS);
        b.corpBox('effect', (ce) => {
          ce.effect('Your Venus requirements are +/- 2 steps, your choice in each case.', (eb) => {
            eb.plate('Venus requirements').startEffect.text('+/- 2');
          });
        });
      }),
    }
}
