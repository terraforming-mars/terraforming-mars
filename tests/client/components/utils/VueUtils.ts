import {Wrapper} from '@vue/test-utils';

export function getDataThing(wrapper: Wrapper<any>, dataTest: string): Wrapper<any> {
  return wrapper.find(`[data-test=${dataTest}]`);
}

export function getInputElement(wrapper: Wrapper<any>, dataTest: string): HTMLInputElement {
  return getDataThing(wrapper, dataTest).element as HTMLInputElement;
}

export async function click(wrapper:Wrapper<any>, dataTest: string) {
  getDataThing(wrapper, dataTest).trigger('click');
  await wrapper.vm.$nextTick();
}
