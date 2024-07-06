import './scss/styles.scss';

// Тип уникального Id карточки
type cardId = string;

// тип котегории для раскраски
enum categoryType {
	category1 = 'софт-скил',
	category2 = 'другое',
	category3 = 'дополнительное',
	category4 = 'кнопка',
	category5 = 'хард-скилл',
}

/// Интерйейс для товара
interface IProductItem {
	id: cardId;
	description: string;
	image: string;
	title: string;
	category: categoryType;
	price: number | null;
}

// Продуктовая модель
interface IProductModel {
	// Товары с сервиса
	items: IProductItem[];
	// Установка товаров в модель
	setItems(items: IProductItem[]): void;
	// Получение модели товаров
	getItems(): IProductItem[];
	// Получение товара по id
	getProduct(id: cardId): IProductItem;
}

// Модель корзины
interface IBasketModel {
	items: Map<cardId, number>;
	//Добавить товар в корзину
	add(id: cardId): void;
	//Удалить товар из корзины
	remove(id: cardId): void;
	//Очистить всю корзину
	clearAll(): void;
	//Получить текущее количсетво товаров в корзине
	getCountProducts(): number;
	//Получить текущую общую сумму корзины
	getTotal(): number;
}

//  Интерфейс способа оплаты с выбором оплаты
interface IPayment {
	// Тип оплаты
	paymentType: paymentType[];
	// выбронный тип оплаты
	select: boolean;
}

// Интерфейс для модели заказа
interface IOrderModel {
	// тип оплаты
	payment: IPayment;
	// адрес
	adress: string;
	// очистить модель и снять выбор со способа оплаты
	clearAll(): void;
}

// Интерфейс для модели контактов
interface IContactModel {
	// номер Телефона
	phone: string;
	// адресс электронной почты
	email: string;
	// очистить модель и снять выбор со способа оплаты
	clearAll(): void;
}

/* Интерйфейс для описания внутреннего состояние приложения 
    и хранения моделий  
*/

interface IAppState {
	productModel: IProductModel;

	basketModel: IBasketModel;

	contactModel: IContactModel;

	orderModel: IOrderModel;

	//Модальное окно активное в данный момент
	modalOpened: HTMLElement;

	// Состояние приложения ( технический статус состояния приложения например для разграничения до и посли загрузки товаров )
	stateApp: string;
}

// Интерфейс для страницы
interface IPage {
	// Счетчик товаров в корзине
	counter: HTMLElement;
	// Список карточек товаров
	store: HTMLElement[];
}

// Интерфейс для карточки товара
interface ICard extends IProductItem {}

// Интерфейс окна корзины
interface IBasket {
	// Лист выбранных товаров в корзине
	list: HTMLElement[];
	// Общая сумма товаров в корзине
	total: HTMLElement;
	//кнопка Оформления в корзине
	button: HTMLButtonElement;
}
// Определение значений типов оплаты
enum paymentType {
	online = 'Онлайн',
	offline = 'При получении',
}

//  Интерфейс окна заказа
interface IOrder {
	// Тип оплаты
	payment: HTMLElement;
	//адрес доставки
	adress: HTMLElement;
}

//  Интерфейс окна контактов
interface IContacts {
	// номер Телефона
	phone: HTMLElement;
	// адресс электронной почты
	email: HTMLElement;
}

interface IApi {
	// Базовый Url
	baseUrl: string;

	//Get запрос сервиса
	get(uri: String): void;

	//Post запрос  на сервис
	post(uri: String, data: Object): void;

	//Обработка ответа от сервиса в виде промиса с данными
	response(response: Response): Promise<Partial<object>>;
}

type EventName = string | RegExp;

//Интерфейс для брокера событий
interface IEvents {
	//Установить обработчик на событие
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	//Инициировать событие с данными
	emit<T extends object>(event: EventName, data?: T): void;
	// Убирает колбэк с события
	off(eventName: EventName, callback: Function): void;
}
//Интерфейс для модального окна
interface IModal {
	// Html элимент для модального окна
	content: HTMLElement;
	// открытие окна
	open(): void;
	// закрытие окна
	close(): void;
	// обработка закрытия по кнопке Esc
	handleEsc(): void;
}

// Абастрактный класс компонента
abstract class Component<T> {
	protected _element: HTMLElement;
	// Конструктор принимает родительский элемент
	protected constructor(protected readonly container: HTMLElement);

	// Добавить/убрать класс Переключить класс
	protected toggleClass(className: string, force?: boolean): void;

	// Установить текстовое содержимое
	setText(text: string): void;

	// Выделить/Снять выделение от значения state
	setSelected(state: boolean): void;

	// Видимый/невидимый  в зависимости от значения state
	setVisible(state: boolean): void;

	// Установить путь до изображения и альтернативный текст если есть
	setImage(src: string, alt?: string): void;

	// Вернуть корневой DOM-элемент
	render(data?: Partial<T>): HTMLElement;
}

// Класс заглавной страницы
class Page extends Component<IPage> {
	// Ссылки на внутренние элементы
	protected _counter: HTMLElement;
	protected _store: HTMLElement;
	protected _basket: HTMLElement;

	// Конструктор принимает родительский элемент и обработчик событий
	constructor(container: HTMLElement, protected events: IEvents);

	// Сеттер для счётчика товаров в корзине
	set counter(value: number);

	// Сеттер для карточек товаров на странице
	set store(items: HTMLElement[]);
}

class Card extends Component<ICard> {
	// Ссылки на внутренние элементы карточки
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	// Конструктор принимает имя блока, родительский контейнер
	constructor(protected blockName: string, container: HTMLElement);

	// Сеттер и геттер для уникального ID
	set id(value: cardId);
	get id(): cardId;

	// Сеттер и гетер для названия
	set title(value: string);
	get title(): string;

	// Сеттер для кратинки
	set image(value: string);

	// Сеттер для определения выбрали товар или нет
	set selected(value: boolean);

	// Сеттер для цены
	set price(value: number | null);

	// Сеттер для категории
	set category(value: CategoryType);
}

class Basket extends Component<IBasket> {
	// Ссылки на внутренние элементы
	protected _list: HTMLElement;
	protected _total: HTMLElement;

	protected _button: HTMLButtonElement;

	// Конструктор принимает имя блока, родительский элемент и обработчик событий кнопки
	constructor(
		protected blockName: string,
		container: HTMLElement,
		protected events: IEvents
	);

	// Сеттер для общей цены товаров
	set total(price: HTMLElement);

	// Сеттер для списка товаров
	set list(items: HTMLElement[]);
}

// Абстрактный класс с добалением валидации и текста ошибок
abstract class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;
	// Конструктор принимает  родительский элемент и обработчик событий кнопки
	constructor(protected container: HTMLFormElement, protected events: IEvents);

	// Вызов события изменения данных
	protected onInputChange(field: keyof T, value: string);

	set valid(value: boolean);

	set errors(value: string);
}

// Класс  модального окна
class FormModal extends Form<IModal> {
	constructor(container: HTMLFormElement);
	// открытие окна
	open(): void;
	// закрытие окна
	close(): void;
	// обработка закрытия по кнопке Esc
	handleEsc(): void;
}
// Класс окна заказа
class Order extends FormModal<IOrder> {
	// Сссылки на внутренние элементы
	protected _payment: HTMLButtonElement;
	protected _adress: HTMLButtonElement;

	// Конструктор принимает имя блока, родительский элемент и обработчик событий
	constructor(
		protected blockName: string,
		container: HTMLFormElement,
		protected events: IEvents
	);
}

// Класс окна контаткной информации
class Contacts extends FormModal<IContacts> {
	// номер Телефона
	protected _phone: HTMLElement;
	// адресс электронной почты
	protected _email: HTMLElement;
	// Конструктор принимает родительский элемент и обработчик событий
	constructor(container: HTMLFormElement, events: IEvents);
}

// Класс апи для работсы с сервисом с асинхронными функциями
class Api extends IApi {
	// Базовый Url
	baseUrl: string;

	// Конструктор принимает базовый URL
	constructor(baseUrl: string);

	//Get запрос сервиса
	async get(uri: String): void;

	//Post запрос  на сервис
	async post(uri: String, data: Object): void;

	//Обработка ответа от сервиса в виде промиса с данными
	protected async response(response: Response): Promise<Partial<object>>;
}

// Класс брокера задач
class EventEmitter implements IEvents {
	// Map состоящий из событий и подписчиков
	_events: Map<EventName, Set<Function>>;

	constructor() {}

	//Установить обработчик на событие
	on<T extends object>(eventName: EventName, callback: (event: T) => void) ;

	// Убирает колбэк с события
	off(eventName: EventName, callback: Function) ;

	//Инициировать событие с данными
	emit<T extends object>(eventName: string, data?: T) ;
}
