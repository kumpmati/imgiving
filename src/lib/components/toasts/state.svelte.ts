import { nanoid } from 'nanoid';

export type Toast = {
	id: string;
	type: 'info' | 'success' | 'warn' | 'err';
	message: string;
	detail?: string;
};

export class Toasts {
	messages = $state<Toast[]>([]);

	info(message: string, detail?: string, timeout?: number) {
		this.create('info', message, detail, timeout);
	}

	success(message: string, detail?: string, timeout?: number) {
		this.create('success', message, detail, timeout);
	}

	warn(message: string, detail?: string, timeout?: number) {
		this.create('warn', message, detail, timeout);
	}

	error(message: string, detail?: string, timeout?: number) {
		this.create('err', message, detail, timeout);
	}

	dismiss(id: string) {
		this.messages.splice(
			this.messages.findIndex((m) => m.id === id),
			1
		);
	}

	private create(type: Toast['type'], message: string, detail?: string, timeout = 3000) {
		const id = nanoid(8);
		this.messages.push({ id, type, message: message, detail });
		setTimeout(() => this.dismiss(id), timeout);
	}
}
