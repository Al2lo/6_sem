const express = require('express');
const hbs = require('express-handlebars').create({extname: '.hbs'});
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const qs = require('qs');


let app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.engine('.hbs',hbs.engine);
app.set('view engine','.hbs');


app.use(express.static("views"));

app.get('/', async function(req, res) {
	fs.readFile('bd.json', 'utf8', (err, users) => {
		if (err) {console.error(err);return;}
		res.render("MainForm.hbs", {users:JSON.parse(users), clickable:false});
	});
});

app.get('/add', async function(req, res) {
	fs.readFile('bd.json', 'utf8', (err, users) => {
		if (err) {console.error(err);return;}
		res.render("AddForm.hbs", {users:JSON.parse(users), clickable:false});
	});
});

app.get('/update', async function(req, res) {
    const id = req.query.id;
console.log(id);
	fs.readFile('bd.json', 'utf8', (err, users) => {
		if (err) {console.error(err);return;}
        let usersList = JSON.parse(users);
        console.log(usersList);
        var user = usersList.find(item => item.id === parseInt(id));
        console.log(user);
		res.render("UpdateForm.hbs", {users:usersList,user:user,updateVar:true,clickable:false});
	});
});

app.post('/add', async function(req, res) {

    const name = req.body.name;
    const number = req.body.number;	

    fs.readFile('bd.json', 'utf8', (err, data) => {
        if (err) {
          console.error('Ошибка при чтении файла:', err);
          return;
        }
      
        try {

          const usersList  = JSON.parse(data);
      
          usersList.push({"id" : usersList.length, "name":`${name}`, "number":`${number}`});
      

          const updatedJson = JSON.stringify(usersList);
      
          fs.writeFile('bd.json', updatedJson, 'utf8', (err) => {
            if (err) {
              console.error('Ошибка при записи файла:', err);
              return;
            }
      
            console.log('Элемент успешно добавлен в конец JSON-файла.');
          });
        } catch (err) {
          console.error('Ошибка при разборе JSON:', err);
        }
      });
      
    res.writeHead(302, {
		'Location': '/'
	});
	res.end();
});

app.post('/update', async function(req, res) {
    
    const id = req.body.id;
    const name = req.body.name;
    const number = req.body.number;	

    fs.readFile('bd.json', 'utf8', (err, data) => {
        if (err) {
          console.error('Ошибка при чтении файла:', err);
          return;
        }
      
        try {
          const usersList  = JSON.parse(data);
      
          usersList[id].name = name;
          usersList[id].number = number;
          
          const updatedJson = JSON.stringify(usersList);
      
          fs.writeFile('bd.json', updatedJson, 'utf8', (err) => {
            if (err) {
              console.error('Ошибка при записи файла:', err);
              return;
            }
      
            console.log('Элемент успешно изменен JSON-файла.');
          });
        } catch (err) {
          console.error('Ошибка при разборе JSON:', err);
        }
      });
      
    res.writeHead(302, {
		'Location': '/'
	});
	res.end();
});

app.delete('/delete', async function(req, res) {
    
    const id = req.query.id;

    console.log(id);
    fs.readFile('bd.json', 'utf8', (err, data) => {
        if (err) {
          console.error('Ошибка при чтении файла:', err);
          return;
        }
      
        try {
          const usersList  = JSON.parse(data);
          var updatedJson = [];
          let j = 0;
          for(var i = 0; i < usersList.length; i ++)
          {
                if(i === parseInt(id))
                    continue;
                updatedJson[j] = usersList[i];
                updatedJson[j].id = j;
                j++;
            }
      
          fs.writeFile('bd.json', JSON.stringify(updatedJson), 'utf8', (err) => {
            if (err) {
              console.error('Ошибка при записи файла:', err);
              return;
            }
            console.log('Элемент успешно удален JSON-файла.');
          });
        } catch (err) {
          console.error('Ошибка при разборе JSON:', err);
        }
      });
      
    res.writeHead(302, {
		'Location': '/'
	});
	res.end();
});

app.listen(3000,'localhost',()=>{console.log("http://localhost:3000/")})