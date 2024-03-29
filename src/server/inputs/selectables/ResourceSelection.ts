import { Resource } from '../../../common/Resource';
import { SelectionType } from '../../../common/input/SelectionType';
import { Message } from '../../../common/logs/Message';
import { SelectionHandler } from './SelectionHandler';

export class ResourceSelection extends SelectionHandler<Resource> {
  constructor(
    title: string | Message,
    buttonLabel: string = 'Save',
    resources: Array<Resource>,
  ) {
    super(resources, SelectionType.RESOURCE, title, buttonLabel);
  }

  public override GetOptionName(option: Resource): string {
    return option;
  }

  // Resources are always the same and don't need a model
  public override OptionAsModel(): boolean {
    return true
  }
}