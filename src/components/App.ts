import {
	IAppState,
	IProductModel,
	IBasketModel,
	IContactModel,
	IOrderModel,
} from '../types';
import { IEvents } from './base/events';
import { productModel, basketModel, orderModel } from './Model';
export class AppState implements IAppState {
	constructor(protected events: IEvents) {
		this.productModel = new productModel(events);
		this.basketModel = new basketModel(events);
		this.orderModel = new orderModel(events);
		this.stateApp = 'init';
	}

	productModel: IProductModel;

	basketModel: IBasketModel;

	orderModel: IOrderModel;

	// Состояние приложения ( технический статус состояния приложения например для разграничения до и посли загрузки товаров )
	stateApp: string;
}
