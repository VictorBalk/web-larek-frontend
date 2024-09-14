import { Component } from './base/Components';
import { IPage } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Page extends Component<IPage> {
	// Ссылки на внутренние элементы
	protected _counter: HTMLElement;
	protected _store: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;
	protected _lastScroll: number;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._store = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	// Сеттер для счётчика товаров в корзине
	set counter(value: number) {
		this._counter.textContent = String(value);
	}

	// Сеттер для блокировки прокрутки 
	set locked(value: boolean) {
		if (value) {
            //Состояние прокурутки до открытия модального окна
			this._lastScroll = window.scrollY;
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
			window.scrollTo(0, this._lastScroll);
		}
	}

	// Сеттер для карточек товаров на странице
	set store(items: HTMLElement[]) {
		this._store.replaceChildren(...items);
	}
}
