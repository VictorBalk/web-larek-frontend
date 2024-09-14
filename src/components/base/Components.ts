// Абастрактный класс компонента
export abstract class Component<T> {
	protected _element: HTMLElement;
	// Конструктор принимает родительский элемент
	protected constructor(protected readonly container: HTMLElement) {}

	// Добавить/убрать класс Переключить класс
	protected toggleClass(className: string, force?: boolean): void {}

	// Установить текстовое содержимое
	protected setText(element: HTMLElement, value: string): void {
		element.textContent = String(value);
	}

	// Установить текстовое содержимое
	protected setValue(element: HTMLInputElement, value: string): void {
		element.value = String(value);
	}

	// Выделить/Снять выделение от значения state
	setSelected(state: boolean): void {}

	// Сменить статус блокировки
	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	// Скрыть
	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	// Показать
	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}
	// Установить путь до изображения и альтернативный текст если есть
	setImage(src: string, alt?: string): void {}

	// Вернуть корневой DOM-элемент
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
