const express = require("express");
  
const app = express();

const jsonParser = express.json();
  
app.use("/form", function(request, response, next){
	console.log(request.headers["user-agent"]);
	if (request.headers["user-agent"].includes("Chrome/") !== -1)
		response.json({status: 403, message: "Access from your browser is forbidden"})
	else
		next();
})

app.post("/form", jsonParser, function (request, response) {
	console.log(request.body);
	var allowed;
	if(request.body){
		if (request.body.userAge < 12)
		{
			console.log("User is a kid");
			allowed = false;
		}
		else if (request.body.userAge > 12 && request.body.userAge < 18)
		{
			console.log("User is a teenager");
			allowed = true;
		}
		else if (request.body.userAge > 18 && request.body.userAge < 26)
		{
			console.log("User is an adult");
			allowed = true;
		}
		request.body.allowed = allowed
		request.body.status = 200
		response.json(request.body);
	} else{
		return response.sendStatus(400);
	}
	
});
  
app.get("/", function(request, response){
    response.sendFile(__dirname + "/static/index.html");
});
  
app.listen(3000);