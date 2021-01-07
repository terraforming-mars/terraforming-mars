import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class TopsoilContract implements IProjectCard {
    public cost = 8;
    public tags = [Tags.MICROBE, Tags.EARTH];
    public name = CardName.TOPSOIL_CONTRACT;
    public cardType = CardType.ACTIVE;

    public play(player: Player) {
      player.plants += 3;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'X25',
      renderData: CardRenderer.builder((b) => {
        b.effect('When you gain a microbe to ANY CARD, also gain 1MC.', (eb) => {
          eb.microbes(1).asterix().startEffect.megacredits(1);
        }).br;
        b.plants(3);
      }),
      description: 'Gain 3 plants.',
    }
}
