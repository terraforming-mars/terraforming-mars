import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class MercurianAlloys implements IProjectCard {
    public name = CardName.MERCURIAN_ALLOYS;
    public cost = 3;
    public tags = [Tags.SPACE];
    public cardType = CardType.ACTIVE;

    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 2;
    }

    public play(player: Player) {
      player.increaseTitaniumValue();
      return undefined;
    }

    public onDiscard(player: Player): void {
      player.decreaseTitaniumValue();
    }
    public metadata: CardMetadata = {
      cardNumber: 'X07',
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)),
      renderData: CardRenderer.builder((b) => {
        b.effect('Your titanium resources are worth 1 MC extra.', (eb) => {
          eb.titanium(1).startEffect.plus(CardRenderItemSize.SMALL).megacredits(1);
        });
      }),
      description: 'Requires 2 Science tags.',
    }
}
