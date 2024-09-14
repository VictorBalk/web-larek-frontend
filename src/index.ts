import './scss/styles.scss';

import { AuctionAPI } from './components/AuctionAPI';
import { AppState } from './components/App';

import { Page } from './components/Page';

import { API_URL, CDN_URL } from './utils/constants';

import { StoreItem, StoreItemPreview } from './components/Card';

import { ensureElement, cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/events';

import { Modal } from './components/base/Modal';

import { Basket, StoreItemBasket } from './components/Basket';
import { Order } from './components/Order';

import { ICard, IOrderFormData, IResposePurchasingGoods } from './types';

import { Contacts } from './components/Contacts';

import { Success } from './components/Success';

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

const events = new EventEmitter();

const api = new AuctionAPI(CDN_URL, API_URL);

const app = new AppState(events);

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

//Загрузка Товаров
api.getProductist().then((result) => {
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
	item.selected = false;
	(basket.total = app.basketModel.getTotal()),
		(page.counter = app.basketModel.getCountProducts());
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

// Валидатор окна с адрессом и способом оплаты
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

// Открыть модальное окно с контактной информацией
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			valid: false,
			errors: [],
		}),
	});
});

// Валидатор окна с контактной информацией
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
	// Отправка покупок
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
