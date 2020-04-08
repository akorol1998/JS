const {Builder, By, Key, until} = require('selenium-webdriver');
const {MongoClient} = require("mongodb");

async function listDatabases(client){
    databaseList = await client.db().admin().listDatabases();
    console.log("Databases");
    databaseList.databases.forEach(db => {console.log(`${db.name}`)});
}

async function main(){
    const uri = "mongodb+srv://akorol:1234pass@cluster0-ascdg.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try{
        await client.connect();
        const db = client.db('Shazam');
        const collection = db.collection("Tracks");
        await parse(collection);
    }catch (e){
        console.error(e);
    }finally{
        await client.close();
    }
    
}

main().catch(console.error);

async function parse(collection){
    var NUM = 51;
    var index = 1;
    let driver = await new Builder().forBrowser("chrome").build();
    try{
        await driver.get('https://www.shazam.com/charts/top-200/ukraine');
        await driver.wait(until.elementLocated(By.className('charttracks')));
        while (index !== NUM){
            try{
                var track = await (await driver.findElement(By.xpath(`/html/body/div[3]/div/main/div/div[2]/div[1]/ul/li[${index}]/article/div/div[2]/div[1]/a`))).getText();
                try{
                    var artist = await (await driver.findElement(By.xpath(`/html/body/div[3]/div/main/div/div[2]/div[1]/ul/li[${index}]/article/div/div[2]/div[2]/a`))).getText();
                }catch(error){
                    var artist = await (await driver.findElement(By.xpath(`/html/body/div[3]/div/main/div/div[2]/div[1]/ul/li[${index}]/article/div/div[2]/div[2]/div`))).getText();
                }
                var audio = await (await driver.findElement(By.xpath(`/html/body/div[3]/div/main/div/div[2]/div[1]/ul/li[${index}]/article/meta[2]`))).getAttribute('content');
                index++;
                await collection.insertOne(
                    {
                        track: track,
                        artist: artist,
                        demo:audio
                    },
                    function(err, result){
                        if (err !== null)
                        console.error(err);
                })
            }catch (err){
                ;
            }
        }
    }finally{
        driver.quit();
    }
};

