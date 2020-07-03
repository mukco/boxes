'use-strict';

/*  
    Pass functions as arguments through an options object. 
    Allows for customization of the generated boxes and 
    the customization of generated boxes' content 
*/

module.exports = {
	// boxAmount is the amount of boxes you want to generate
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
