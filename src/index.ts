import './scss/styles.scss';

import { AuctionAPI } from './components/AuctionAPI';
import { AppState } from './components/App';

import { Page } from './components/Page';

import { API_URL, CDN_URL } from './utils/constants';

import { StoreItem, StoreItemPreview } from './components/Card';

import { ensureElement, cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/events';

import { Modal } from './components/Modal';

import { Basket, StoreItemBasket } from './components/Basket';
import { Order } from './components/Order';

import {
	ICard,
	IOrderModel,
	IOrderFormData,
	IResposePurchasingGoods,
} from './types';

import { Contacts } from './components/Contacts';

import { Success } from './components/Success';

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);

// // Модель данных приложения
// const appData = new AppState({}, events);
const app = new AppState(events);

// Все шаблоны
const storeProductTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const modalTemplate = ensureElement<HTMLElement>('#modal-container');

const modal = new Modal(modalTemplate, events);

const page = new Page(document.body, events);

const basket = new Basket('basket', cloneTemplate(basketTemplate), events);

const order = new Order('order', cloneTemplate(orderTemplate), events);

const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

const success = new Success('order-success', cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
	},
});

api
	.getProductist()
	.then((result) => {
		console.log(result);
		app.productModel.setItems(result);
	})
	.catch((err) => {
		console.error(err);
	});

// Изменились элементы каталога
events.on('items:changed', () => {
	api.getProductist().then((list) => {
		page.store = list.map((item) => {
			const product = new StoreItem(cloneTemplate(storeProductTemplate), {
				onClick: () => events.emit('card:select', item),
			});
			return product.render({
				id: item.id,
				title: item.title,
				image: item.image,
				category: item.category,
				price: item.price,
			});
		});
	});
});

// Открытие карточки
events.on('card:select', (item: ICard) => {
	//   page.locked = false;
	const product = new StoreItemPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:addBasket', item);
		},
	});
	modal.render({
		content: product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			description: item.description,
			price: item.price,
			selected: item.selected,
		}),
	});
});

// Закрытие модального окна
events.on('modal:open', () => {
	page.locked = true;
	document.addEventListener('keydown', modal.handleEsc.bind(modal));
});
events.on('modal:close', () => {
	page.locked = false;
	document.removeEventListener('keydown', modal.handleEsc.bind(modal));
});

// Добавление товара в корзину
events.on('card:addBasket', (item: ICard) => {
	item.selected = true;
	app.basketModel.add(item);
	page.counter = app.basketModel.getCountProducts();
	modal.close();
});

// Открытие корзины
events.on('basket:open', () => {
	page.locked = true;
	const basketItems = app.basketModel.getItems().map((item, index) => {
		const storeItem = new StoreItemBasket(
			'card',
			cloneTemplate(cardBasketTemplate),
			{
				onClick: () => events.emit('basket:del', item),
			}
		);

		return storeItem.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});

	modal.render({
		content: basket.render({
			list: basketItems,
			total: app.basketModel.getTotal(),
		}),
	});
});

// Удаление из корзины
events.on('basket:del', (item: ICard) => {
	app.basketModel.remove(item.id);
	// appData.deleteFromBasket(item.id);
	item.selected = false;
	basket.total = app.basketModel.getTotal(),
	page.counter = app.basketModel.getCountProducts();
	basket.refreshIndices();
	if (app.basketModel.getCountProducts() === 0) {
		basket.disableButton();
		modal.close();
	}
});

//   Открытие формы заказа
events.on('basket:order', () => {
	order.disableButtons();
	app.orderModel.clearAll();
	modal.render({
		content: order.render({
			valid: false,
			errors: [],
		}),
	});
});

// Изменились введенные данные
events.on(
	'order:change',
	(data: { field: keyof IOrderFormData; value: string }) => {
		app.orderModel.setDataField(data.field, data.value);
		let errors = [] as String[];
		// const errors: typeof order.formErrors = {};
		if (!app.orderModel.getData().address) {
			errors.push('Необходимо указать адрес');
		}

		if (!app.orderModel.getData().payment) {
			errors.push('Необходимо указать способ оплаты');
		}

		order.valid = !(errors.length > 0);
		order.errors = errors.join('');
	}
);

// Заполнить телефон и почту
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	'contacts:change',
	(data: { field: keyof IOrderFormData; value: string }) => {
		app.orderModel.setDataField(data.field, data.value);
		let errors = [] as String[];
		// const errors: typeof order.formErrors = {};
		if (!app.orderModel.getData().phone) {
			errors.push('Необходимо указать телефон');
		}

		if (!app.orderModel.getData().email) {
			errors.push('Необходимо указать email');
		}

		contacts.valid = !(errors.length > 0);
		contacts.errors = errors.join('');
	}
);

// Покупка товаров
events.on('contacts:submit', () => {
	let payload = {
		payment: app.orderModel.getData().payment,
		email: app.orderModel.getData().email,
		phone: app.orderModel.getData().phone,
		address: app.orderModel.getData().address,
		total: app.basketModel.getTotal(),
		items: app.basketModel.getItems().map((el) => el.id),
	};

	api
		.purchasingGoods(payload)
		.then((res) => {
			events.emit('order:success', res);
			app.basketModel.clearAll();
			app.productModel.getItems();
			page.counter = app.basketModel.getCountProducts();
			app.productModel.refreshItems();
		})
		.catch((err) => {
			console.log(err);
		});
});

// Окно успешной покупки
events.on('order:success', (res: IResposePurchasingGoods) => {
	modal.render({
		content: success.render({
			description: res.total,
		}),
	});
});

// 'basket:order'

//   order:change

// // Класс заглавной страницы
// class Page extends Component<IPage> {
// 	// Ссылки на внутренние элементы
// 	protected _counter: HTMLElement;
// 	protected _store: HTMLElement;
// 	protected _basket: HTMLElement;

// 	// Конструктор принимает родительский элемент и обработчик событий
// 	constructor(container: HTMLElement, protected events: IEvents);

// 	// Сеттер для счётчика товаров в корзине
// 	set counter(value: number);

// 	// Сеттер для карточек товаров на странице
// 	set store(items: HTMLElement[]);
// }

// class Card extends Component<ICard> {
// 	// Ссылки на внутренние элементы карточки
// 	protected _title: HTMLElement;
// 	protected _image: HTMLImageElement;
// 	protected _category: HTMLElement;
// 	protected _price: HTMLElement;
// 	protected _button: HTMLButtonElement;

// 	// Конструктор принимает имя блока, родительский контейнер
// 	constructor(protected blockName: string, container: HTMLElement);

// 	// Сеттер и геттер для уникального ID
// 	set id(value: cardId);
// 	get id(): cardId;

// 	// Сеттер и гетер для названия
// 	set title(value: string);
// 	get title(): string;

// 	// Сеттер для кратинки
// 	set image(value: string);

// 	// Сеттер для определения выбрали товар или нет
// 	set selected(value: boolean);

// 	// Сеттер для цены
// 	set price(value: number | null);

// 	// Сеттер для категории
// 	set category(value: CategoryType);
// }

// class Basket extends Component<IBasket> {
// 	// Ссылки на внутренние элементы
// 	protected _list: HTMLElement;
// 	protected _total: HTMLElement;

// 	protected _button: HTMLButtonElement;

// 	// Конструктор принимает имя блока, родительский элемент и обработчик событий кнопки
// 	constructor(
// 		protected blockName: string,
// 		container: HTMLElement,
// 		protected events: IEvents
// 	);

// 	// Сеттер для общей цены товаров
// 	set total(price: HTMLElement);

// 	// Сеттер для списка товаров
// 	set list(items: HTMLElement[]);
// }

// // Абстрактный класс с добалением валидации и текста ошибок
// abstract class Form<T> extends Component<IFormState> {
// 	protected _submit: HTMLButtonElement;
// 	protected _errors: HTMLElement;
// 	// Конструктор принимает  родительский элемент и обработчик событий кнопки
// 	constructor(protected container: HTMLFormElement, protected events: IEvents);

// 	// Вызов события изменения данных
// 	protected onInputChange(field: keyof T, value: string);

// 	set valid(value: boolean);

// 	set errors(value: string);
// }

// // Класс  модального окна
// class FormModal extends Form<IModal> {
// 	constructor(container: HTMLFormElement);
// 	// открытие окна
// 	open(): void;
// 	// закрытие окна
// 	close(): void;
// 	// обработка закрытия по кнопке Esc
// 	handleEsc(): void;
// }
// // Класс окна заказа
// class Order extends FormModal<IOrder> {
// 	// Сссылки на внутренние элементы
// 	protected _payment: HTMLButtonElement;
// 	protected _adress: HTMLButtonElement;

// 	// Конструктор принимает имя блока, родительский элемент и обработчик событий
// 	constructor(
// 		protected blockName: string,
// 		container: HTMLFormElement,
// 		protected events: IEvents
// 	);
// }

// // Класс окна контаткной информации
// class Contacts extends FormModal<IContacts> {
// 	// номер Телефона
// 	protected _phone: HTMLElement;
// 	// адресс электронной почты
// 	protected _email: HTMLElement;
// 	// Конструктор принимает родительский элемент и обработчик событий
// 	constructor(container: HTMLFormElement, events: IEvents);
// }

// // Класс апи для работсы с сервисом с асинхронными функциями
// class Api extends IApi {
// 	// Базовый Url
// 	baseUrl: string;

// 	// Конструктор принимает базовый URL
// 	constructor(baseUrl: string);

// 	//Get запрос сервиса
// 	async get(uri: String): void;

// 	//Post запрос  на сервис
// 	async post(uri: String, data: Object): void;

// 	//Обработка ответа от сервиса в виде промиса с данными
// 	protected async response(response: Response): Promise<Partial<object>>;
// }

// // Класс брокера задач
// class EventEmitter implements IEvents {
// 	// Map состоящий из событий и подписчиков
// 	_events: Map<EventName, Set<Function>>;

// 	constructor() {}

// 	//Установить обработчик на событие
// 	on<T extends object>(eventName: EventName, callback: (event: T) => void) ;

// 	// Убирает колбэк с события
// 	off(eventName: EventName, callback: Function) ;

// 	//Инициировать событие с данными
// 	emit<T extends object>(eventName: string, data?: T) ;
// }
