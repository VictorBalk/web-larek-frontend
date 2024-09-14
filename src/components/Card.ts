import { ICard, categoryType } from '../types';
import { Component } from './base/Components';
import { ensureElement } from '../utils/utils';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._button = container.querySelector(`.${blockName}__button`);
		this._category = container.querySelector(`.${blockName}__category`);
		this._price = container.querySelector(`.${blockName}__price`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	// Сеттер и геттер для id
	set id(value: string) {
		this.container.dataset.id = value;
	}

	// Сеттер и гетер для названия
	set title(value: string) {
		this._title.textContent = value;
	}

	// Сеттер для выбора
	set selected(value: boolean) {
		if (!this._button.disabled) {
			this._button.disabled = value;
		}
	}

	// Сеттер для цены
	set price(value: number | null) {
		this._price.textContent =
			value === null ? 'Бесценно' : value.toString() + ' синапсов';
		if (this._button && !value) {
			this._button.disabled = true;
		}
	}

	// Сеттер для кратинки
	set image(value: string) {
		this._image.src = value;
	}

	// Сеттер для категории
	set category(value: categoryType) {
		this._category.textContent = String(value);
		this._category.classList.add(`card__category_` + categoryType[value]);
	}
}

//
export class StoreItem extends Card {
	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
	}
}

export class StoreItemPreview extends Card {
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);

		this._description = container.querySelector(`.${this.blockName}__text`);
	}

	set description(value: string) {
		this._description.textContent = value;
	}
}
