'use-strict';
class TooManyBoxesError extends Error {}
/*  
    Pass functions as arguments through an options object. 
    Allows for customization of the generated boxes and 
    the customization of generated boxes' content 
*/

module.exports = {
	// boxAmount is the amount of boxes you want to generate
	engines: {
		generateBoxes: function ({ boxAmount, boxOptions }) {
            if (boxAmount > 1000) throw new TooManyBoxesError('You cannot create more than 1000 boxes') // You cannot create more than 1000 boxes
            let boxArr = [];
			let token = boxAmount;
			do {
                boxArr[token] = boxOptions();
				boxArr[token].unlock();
			    boxArr[token].lock();
				token--;
            } while (token >= 0);
            return boxArr;
		},
	},
};
