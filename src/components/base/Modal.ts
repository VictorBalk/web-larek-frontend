import { IModal } from '../../types';
import { Component } from './Components';
import { ensureElement } from '../../utils/utils';
import { IEvents } from './events';

interface IModalData {
	content: HTMLElement;
}
export class Modal extends Component<IModalData> implements IModal {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._content = ensureElement<HTMLElement>('.modal__content', container);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);

		this.container.addEventListener('click', this.close.bind(this));
		this._closeButton.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	handleEsc(event: KeyboardEvent): void {
		if (event.key == 'Escape') {
			this.close();
		}
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
