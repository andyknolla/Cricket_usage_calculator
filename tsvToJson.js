const fs = require("fs");
const usageFileNames = ['July', 'August', 'September'];
const arrayOfUsageArrays = []; // [ [ {date: 8/5/2018, usage: 12 MB}, {} ], [SeptUsage],  ]

function transform(err, data) {
  // console.log('data: ', data);
    var rows = data.split("\n");
    var collection = [];
    var keys = [];

    rows.forEach((value, index)=>{
        if (index < 1) {// get the keys from the first row in the tab space file
            keys = value.split("\t");
        } else {// put the values from the following rows into object literals
            values = value.split("\t");
            collection[index-1] = values.map((value, index) => {
                return {
                    [keys[index]]: value
                }
            }).reduce((currentValue, previousValue) => {
                return {
                    ...currentValue,
                    ...previousValue
                }
            });
        }
    })

		const cleanedUpObjects = collection.filter( item => {
		  return item.usage !== ""
		}).map( item => {
		  return item.usage ? { date: item.date, usage: item.usage.replace(" MB", "")} : {};
    });
    // console.log('cleanedUpObjects: ', cleanedUpObjects);
		arrayOfUsageArrays.push(cleanedUpObjects);

		// buildArrayOfUsageObjects(cleanedUpObjects);	??

    // convert array of objects into json str, and then write it back out to a file
    // let jsonStr = JSON.stringify(collection);
    // fs.writeFileSync("./SeptUsage.json", jsonStr, {encoding: "utf8"})
    // fs.writeFileSync("./cricketObject.js", json, {encoding: "utf8"})
};



function collectUsageArrays(arrOfMonths, callback) {
	arrOfMonths.forEach( month => {
		const filename = `./${month}Usage.txt`;
		fs.readFile(filename, "utf8", transform);
	});
	return arrayOfUsageArrays;
};

function addDataValues(arrOfObj) {
  const total = arrOfObj.reduce( (accumulator, obj) => {
    const usageNumber = obj.usage ? Number(obj.usage) : 0;
    return accumulator + usageNumber;
  }, 0)
	return total
};

function usageReport(arrOfArrays) {
	// output a report for data usage over all months with data
	arrOfArrays.forEach( array => {
		const total = addDataValues(array);
		const output = `Data usage for the month was ${total} MB`;
		console.log('output ', output);
	});
};

collectUsageArrays(usageFileNames, usageReport);

setTimeout(function() {
  usageReport(arrayOfUsageArrays)
}, 500);