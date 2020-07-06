'use-strict';
class LockedBoxError extends Error {}
class NoBoxesError extends Error {}
class BoxOffError extends Error {}
const crypto = require('crypto');
const Generators = require('./generators.js');

class Box {
	constructor(content, key) {
		this._id = Math.floor(Math.random() * 10000);
		this.locked = true;
		this._content = content || [];
		this.created_at = new Date();
		this.key = (function () {
			let cryptKey = key || Math.floor(Math.random() * 10000).toString();
			let encryptedKey = crypto.scryptSync(cryptKey, 'salt', 24);
			return encryptedKey;
		})();
	}
	unlock() {
		this.locked = false;
	}
	lock() {
		this.locked = true;
	}
	get content() {
		if (this.locked) throw new LockedBoxError('The box is locked');
		else return this._content;
	}
	setContent(box, body) {
		if (box.locked) throw new LockedBoxError('The box is locked');
		return body(box); // access any properties conent may have. Also allows for properties to added.
	}
}
class BoxCleaner {
	constructor() {
		(this.on = false), (this._queue = []);
		this.FAILURE_STAGE = new Map();
		(this.FAILURE_STAGE['STAGE_ONE'] = 'You may want to call turnOn on the BoxCleaner instance'),
			(this.FAILURE_STAGE['STAGE_TWO'] =
				'The BoxCleaner queue cannot be empty when called to clean');
		this.FAILURE_STAGE['STAGE_THREE'] = 'Box is locked';
	}
	turnOn = () => {
		this.on = true;
		return this;
	};
	turnOff = () => {
		this.on = false;
		return this;
	};
	cleanBoxes = async () => {
		return new Promise((resolve, reject) => {
			let _queue = this._queue;
			let cleanBoxes = [];
			for (let i = 0; i <= _queue.length - 1; i++) {
				try {
					let box = _queue[i];
					if (!this.on) return reject(new BoxOffError(this.FAILURE_STAGE.STAGE_ONE));
					if (this._queue.length == 0)
						return reject(new NoBoxesError(this.FAILURE_STAGE.STAGE_TWO));
					if (box.locked) {
						box.unlock();
					}
					box.setContent = (box) => {
						return (box._content = []);
					};
					cleanBoxes.unshift(box);
					box.lock();
				} catch (e) {
					if (e instanceof LockedBoxError)
						return reject(new LockedBoxError(this.FAILURE_STAGE.STAGE_THREE));
					else throw e;
				}
			}
			this._queue = [];
			this.turnOff();
			return resolve(cleanBoxes);
		});
	};
	set addBox(box) {
		if (!this.on) throw new NoBoxesError(this.FAILURE_STAGE.STAGE_ONE);
		this._queue.push(box);
		this._queue = this._queue.flat(); // Need to find a better way to flatten the array
	}
	get queueLength() {
		return this._queue.length;
	}
}
const boxGenerationOptions = {
	boxAmount: 1,
	boxOptions: () => {
		return new Box({ 
			crypto: crypto
		});
	},
};

const boxes = Generators.engines.generateBoxes(boxGenerationOptions);
console.log(boxes);
const boxCleaner = new BoxCleaner();
boxCleaner.turnOn();
boxCleaner.addBox = boxes;
console.log(boxCleaner);
try {
	const cleanBoxes = boxCleaner.cleanBoxes();
	console.log(cleanBoxes);
} catch (e) {
	console.log(e);
}
