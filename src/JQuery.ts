import TypeGuards from './TypeGuards';

export type PropName =
	| string
	| Element
	| NodeListOf<Element>
	| Element[]
	| null
	| undefined
	| (() => any);

class JQuery {
	private elements: Element[] = [];

	constructor(prop: PropName) {
		if (TypeGuards.isSelector(prop)) {
			this.elements = [...document.querySelectorAll(prop)];
		} else if (TypeGuards.isElement(prop)) {
			this.elements = [prop];
		} else if (TypeGuards.isNodeList(prop)) {
			this.elements = [...prop];
		} else if (TypeGuards.isArrayOfElements(prop)) {
			this.elements = prop;
		} else if (TypeGuards.isReadyFunction(prop)) {
			document.addEventListener('DOMContentLoaded', prop);
		}
	}

	text(): string;
	text(input: string): this;
	text(input: (index: number, originalText: string) => string): this;
	text(input?: any): any {
		if (input == null) {
			return this.elements.reduce((acc, curr) => acc + (curr.textContent ?? ''), '');
		}

		if (typeof input === 'string') {
			this.elements.forEach((el) => (el.textContent = input));
		} else if (typeof input === 'function') {
			this.elements.forEach((el, index) => {
				el.textContent = input(index, el.textContent);
			});
		}

		return this;
	}

	html(): string;
	html(input: string): this;
	html(input: (index: number, originalText: string) => string): this;
	html(input?: any): any {
		if (input == null) {
			return this.elements.reduce((acc, curr) => acc + curr.innerHTML, '');
		}

		if (typeof input === 'string') {
			this.elements.forEach((el) => (el.innerHTML = input));
		} else if (typeof input === 'function') {
			this.elements.forEach((el, index) => {
				el.innerHTML = input(index, el.innerHTML);
			});
		}

		return this;
	}

	val(): string;
	val(input: string): this;
	val(input: (index: number, originalText: string) => string): this;
	val(input?: any): any {
		if (input == null) {
			return this.elements.reduce((acc, curr) => {
				if (!(curr instanceof HTMLInputElement)) return acc;

				return acc + curr.value;
			}, '');
		}

		if (typeof input === 'string') {
			this.elements.forEach((el) => {
				if (el instanceof HTMLInputElement) el.value = input;
			});
		} else if (typeof input === 'function') {
			this.elements.forEach((el, index) => {
				if (el instanceof HTMLInputElement) el.value = input(index, el.value);
			});
		}

		return this;
	}

	attr(attribute: string): string | null;
	attr(attribute: { [attribute: string]: string }): this;
	attr(attribute: string, modifier: string): this;
	attr(attribute: string, modifier: (index: number, originalValue: string) => string): this;
	attr(attribute: any, modifier?: any): any {
		if (modifier == null) {
			if (typeof attribute === 'string') {
				if (!this.elements.length) return null;

				return this.elements[0].getAttribute(attribute);
			} else {
				const attributeEntries = Object.entries(attribute);

				this.elements.forEach((el) => {
					attributeEntries.forEach(([a, value]) => el.setAttribute(a, value as string));
				});

				return this;
			}
		} else {
			if (typeof modifier === 'string') {
				this.elements.forEach((el) => {
					el.setAttribute(attribute, modifier);
				});
			} else {
				this.elements.forEach((el, index) => {
					el.setAttribute(attribute, modifier(index, el.getAttribute(attribute)));
				});
			}

			return this;
		}
	}
}

export default JQuery;
