import { IEvents } from './events';
import { IProductModel, IProductItem, cardId, IBasketModel, ICard, IOrderModel, IPayment, IOrderFormData } from '../../types';

export const isModel = (obj: unknown): obj is Model<any> => {
    return obj instanceof Model;
};

/**
 * Базовая модель, чтобы можно было отличить ее от простых объектов с данными
 */
export abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }
    // Сообщить всем что модель поменялась
    emitChanges(event: string, payload?: object) {
        // Состав данных можно модифицировать
        this.events.emit(event, payload ?? {});
    }

    // далее можно добавить общие методы для моделей
}

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
        this._items = this._items.filter((el) => { return el.id !== id });
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

    getItems(): ICard[] {
        return this._items
    }
}

export class orderModel implements IOrderModel {
    constructor(protected _events: IEvents) {
        this._events;
        this.clearAll();
    }
    // тип оплаты
    protected orderData: IOrderFormData;
    // номер Телефона
    // очистить модель и снять выбор со способа оплаты

    setDataField(field: keyof IOrderFormData, value: string): void {
        this.orderData[field] = value;

    }

    getData(): IOrderFormData {
        return this.orderData;
    }

    clearAll(): void {
        this.orderData = <IOrderFormData>{};
    }
}