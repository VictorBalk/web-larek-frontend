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
interface ICard extends IProductItem { }

// Интерфейс окна корзины
interface IBasket {
    // Лист выбранных товаров в корзине
    list: HTMLElement[];
    // Общая сумма товаров в корзине
    total: HTMLElement;
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
    //Сделать коллбек триггер, генерирующий событие при вызове
    trigger<T extends object>(
        event: EventName,
        context?: Partial<T>
    ): (data: T) => void;
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