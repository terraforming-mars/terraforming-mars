// Some bits of the HTMLDialogElement api are not generally available or functional with most browsers
// So this just encapsulated all of the uses in one place.
//

export function windowHasHTMLDialogElement(): boolean {
  return 'HTMLDialogElement' in window;
}

export function hasShowModal(dialogElement: HTMLElement): dialogElement is HTMLDialogElement {
  return 'showModal' in dialogElement && dialogElement.showModal !== undefined && typeof(dialogElement.showModal) === 'function';
}

export function showModal(dialogElement: HTMLDialogElement) {
  dialogElement.showModal?.();
}
