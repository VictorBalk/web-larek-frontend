import { IEvents } from './base/events';
import { Form } from './base/form';
import { IOrderFormData } from '../types';
import { ensureElement } from '../utils/utils';

export class Order extends Form<IOrderFormData> {
	// Сссылки на внутренние элементы
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	// Конструктор принимает имя блока, родительский элемент и обработчик событий
	constructor(
		protected blockName: string,
        container: HTMLFormElement,
		protected events: IEvents
	) {
		super(container, events);
        //Кнопки оплаты
		this._card = container.elements.namedItem('card') as HTMLButtonElement;
		this._cash = container.elements.namedItem('cash') as HTMLButtonElement;

		if (this._cash) {
			this._cash.addEventListener('click', () => {
				this._cash.classList.add('button_alt-active');
				this._card.classList.remove('button_alt-active');
				this.onChange('payment', 'cash');
			});
		}

		if (this._card) {
			this._card.addEventListener('click', () => {
				this._card.classList.add('button_alt-active');
				this._cash.classList.remove('button_alt-active');
				this.onChange('payment', 'card');
			});
		}
	}

	//Сбрасываем кнопки
	disableButtons() {
		this._cash.classList.remove('button_alt-active');
		this._card.classList.remove('button_alt-active');
	}
}
