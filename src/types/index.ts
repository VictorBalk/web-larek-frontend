import '../scss/styles.scss';

// Тип уникального Id карточки
export type cardId = string;

// тип котегории для раскраски
export enum categoryType {
	soft = 'софт-скил' as any,
	other = 'другое' as any,
	additional = 'дополнительное' as any,
	button = 'кнопка' as any,
	hard = 'хард-скилл' as any,
}

/// Интерйейс для товара
export interface IProductItem {
	id: cardId;
	description: string;
	image: string;
	title: string;
	category: categoryType;
	price: number | null;
}

// Продуктовая модель
export interface IProductModel {
	// Товары с сервиса
	items: IProductItem[];
	// Установка товаров в модель
	setItems(items: IProductItem[]): void;
	// Получение модели товаров
	getItems(): IProductItem[];
	// Получение товара по id
	getProduct(id: cardId): IProductItem;
	//Обновить Элементы
	refreshItems(): void;
}

// Модель корзины
export interface IBasketModel {
	//Добавить товар в корзину
	add(items: ICard): void;
	//Удалить товар из корзины
	remove(id: cardId): void;
	//Очистить всю корзину
	clearAll(): void;
	//Получить текущее количсетво товаров в корзине
	getCountProducts(): number;
	//Получить текущую общую сумму корзины
	getTotal(): number;

	getItems(): ICard[];
}

// Интефейс с полями для покупок
export interface IPurchasingGoods {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: cardId[];
}

// Интефейс при успшной покупке
export interface IResposePurchasingGoods {
	id: cardId;
	total: number;
}

// Интефейс с состояние формы 
export interface IFormState {
	valid: boolean;
	errors: string[];
}
//  Интерфейс способа оплаты с выбором оплаты
export interface IPayment {
	// Тип оплаты
	paymentType: paymentType[];
	// выбронный тип оплаты
	select: boolean;
}

// Интерфейс для модели заказа
export interface IOrderFormData {
	payment: string;
	// адрес
	address: string;
	// номер Телефона
	phone: string;
	// адресс электронной почты
	email: string;
	// очистить модель и снять выбор со способа оплаты
}

export interface IOrderModel {
	getData(): IOrderFormData;

	setDataField(field: keyof IOrderFormData, value: string): void;

	clearAll(): void;
}

// Интерфейс для модели контактов
export interface IContactModel {
	// номер Телефона
	phone: string;
	// адресс электронной почты
	email: string;
	// очистить модель и снять выбор со способа оплаты
	clearAll(): void;
}

 
// Интерйфейс хранения моделий  
export interface IAppState {
	//Модель с товарами
	productModel: IProductModel;
	//Модель карзины с товрами
	basketModel: IBasketModel;
	//Модель с информацией по заказу
	orderModel: IOrderModel;
	// Состояние приложения ( технический статус состояния приложения например для разграничения до и посли загрузки товаров )
	stateApp: string;
}

// Интерфейс для страницы
export interface IPage {
	// Счетчик товаров в корзине
	counter: HTMLElement;
	// Список карточек товаров
	store: HTMLElement[];
}

// Интерфейс для карточки товара
export interface ICard extends IProductItem {
	selected: boolean;
}

// Интерфейс окна корзины
export interface IBasket {
	// Лист выбранных товаров в корзине
	list: HTMLElement[];
	// Общая сумма товаров в корзине
	total: number;
	//кнопка Оформления в корзине
	button: HTMLButtonElement;
}
// Определение значений типов оплаты
export enum paymentType {
	online = 'Онлайн',
	offline = 'При получении',
}

//Интерфейс c событием на экране успешнйо покупки
export interface ISuccessActions {
	onClick: (event: MouseEvent) => void;
}
// Интерфейс для Окна с успешной покупкой
export interface ISuccess {
	description: number;
}

//  Интерфейс окна контактов
export interface IContacts {
	// номер Телефона
	phone: string;
	// адресс электронной почты
	email: string;
}

export type EventName = string | RegExp;

//Интерфейс для брокера событий
export interface IEvents {
	//Установить обработчик на событие
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	//Инициировать событие с данными
	emit<T extends object>(event: EventName, data?: T): void;
	// Убирает колбэк с события
	off(eventName: EventName, callback: Function): void;
}
//Интерфейс для модального окна
export interface IModal {
	// Html элимент для модального окна
	content: HTMLElement;
	// открытие окна
	open(): void;
	// закрытие окна
	close(): void;
	// обработка закрытия по кнопке Esc
	handleEsc(evt: Event): void;
	//Отрисовка окна
	render(data: IModal): HTMLElement;
}
