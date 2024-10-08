import { Component } from './Components';
import { ensureElement } from '../../utils/utils';
import { IEvents } from './events';
import { IFormState } from '../../types';

export class  Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onChange(field, value);
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected onChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}:change`, { field, value });
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
        this.container.reset();
		Object.assign(this, inputs);
		return this.container;
	}
}
