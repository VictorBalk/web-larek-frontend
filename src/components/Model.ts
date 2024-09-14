import { IEvents } from './base/events';
import {
	IProductModel,
	IProductItem,
	cardId,
	IBasketModel,
	ICard,
	IOrderModel,
	IPayment,
	IOrderFormData,
} from '../types';

export class productModel implements IProductModel {
	constructor(protected _events: IEvents) {
		this._events;
	}
	items: IProductItem[];
	// Установка товаров в модель
	setItems(items: IProductItem[]): void {
		this.items = items;
		this._events.emit('items:changed', { store: this.items });
	}
	// Получение модели товаров
	getItems(): IProductItem[] {
		return this.items;
	}
	// Получение товара по id
	getProduct(id: cardId): IProductItem {
		return this.items.find((el) => {
			return el.id === id;
		});
	}
	//Пересоздать элименты
	refreshItems() {
		this._events.emit('items:changed', { store: this.items });
	}
}

export class basketModel implements IBasketModel {
	constructor(protected _events: IEvents) {
		this._events;
		this._items = [];
	}

	protected _items: ICard[];
	//Добавить товар в корзину
	add(item: ICard): void {
		this._items.push(item);
	}
	//Удалить товар из корзины
	remove(id: cardId): void {
		this._items = this._items.filter((el) => {
			return el.id !== id;
		});
	}
	//Очистить всю корзину
	clearAll(): void {
		this._items = [];
	}
	//Получить текущее количсетво товаров в корзине
	getCountProducts(): number {
		return this._items.length;
	}
	//Получить текущую общую сумму корзины
	getTotal(): number {
		return Array.from(this._items).reduce((acc, val) => acc + val.price, 0);
	}

	//Получить Все Товары
	getItems(): ICard[] {
		return this._items;
	}
}

export class orderModel implements IOrderModel {
	constructor(protected _events: IEvents) {
		this._events;
		this.clearAll();
	}

	protected orderData: IOrderFormData;

	//Устаналиваем значение в модель из формы
	setDataField(field: keyof IOrderFormData, value: string): void {
		this.orderData[field] = value;
	}
	//Получить модель
	getData(): IOrderFormData {
		return this.orderData;
	}
	//Очистить модель
	clearAll(): void {
		this.orderData = <IOrderFormData>{};
	}
}
