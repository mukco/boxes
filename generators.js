'use-strict';

/*  functions that generates boxes.
    You can pass a number of boxes into the genrator
    or you can get a set amount of boxes you want to return. 
    it returns the boxes in a new array
*/

module.exports = {
	// ranMultToken and ranMultBox are multipliers for box and token generation
	engines: {
		generateBoxes: function ({ boxAmount, boxContentOptions = () => undefined, boxOptions = () => undefined }) {
			let boxArr = [];
			let token = boxAmount;
			do {
                boxArr[token] = boxOptions();
				boxArr[token].unlock();
				boxContentOptions(boxArr[token]);
			    boxArr[token].lock();
				token--;
            } while (token >= 0);
            return boxArr;
		},
	},
};
