import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class LunarMining implements IProjectCard {
    public cost = 11;
    public tags = [Tags.EARTH];
    public name = CardName.LUNAR_MINING;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.TITANIUM, Math.floor((player.getTagCount(Tags.EARTH)+1) / 2));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'C22',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => {
          pb.titanium(1).slash().earth(2).played;
        });
      }),
      description: 'Increase your titanium production 1 step for every 2 Earth tags you have in play, including this.',
    };
}
