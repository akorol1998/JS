const {Builder, By, Key, until} = require('selenium-webdriver');

(async function example(){
	var NUM = 51;
	var index = 1;
	let driver = await new Builder().forBrowser("chrome").build();
	try{
		await driver.get('https://www.shazam.com/charts/top-200/ukraine');
		await driver.wait(until.elementLocated(By.className('charttracks')));
		while (index !== NUM){
				console.log(index);
			try{
				var track = await (await driver.findElement(By.xpath(`/html/body/div[3]/div/main/div/div[2]/div[1]/ul/li[${index}]/article/div/div[2]/div[1]/a`))).getText();
				console.log(track);
				try{
					var artist = await (await driver.findElement(By.xpath(`/html/body/div[3]/div/main/div/div[2]/div[1]/ul/li[${index}]/article/div/div[2]/div[2]/a`))).getText();
					console.log(artist);
				}catch(error){
					var artist = await (await driver.findElement(By.xpath(`/html/body/div[3]/div/main/div/div[2]/div[1]/ul/li[${index}]/article/div/div[2]/div[2]/div`))).getText();
					console.log(artist);
				}
				var audio = await (await driver.findElement(By.xpath(`/html/body/div[3]/div/main/div/div[2]/div[1]/ul/li[${index}]/article/meta[2]`))).getAttribute('content');
				console.log(audio);
				index++;
			}catch (err){
				;
			}
		}
	}finally{
		driver.quit();
	}
})();
