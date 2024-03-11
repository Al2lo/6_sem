const Sequelize = require('sequelize');
const sequelize = new Sequelize('LAD','student','fitfit',{host:'127.0.0.1',dialect:'mssql',define:{
    hooks:{
        beforeBulkDestroy:(instance,options)=>{console.log('beforeDestroy')}
        }
    }});
const {Faculty,Pulpit,Teacher,Subjects,Auditorium_type,Auditorium} = require('./laba13_models').ORM(sequelize);
const http=require("http");
const url=require("url");
const fs=require("fs");


sequelize.authenticate()
.then(()=>{
    console.log("connected");
    http.createServer((request,response)=>{
        if(request.method == 'GET')
        {
            if(url.parse(request.url).pathname == '/')
            {
                response.writeHead(200,{"Content-type" : "text/html"});
                let file = fs.readFileSync('index.html');
                response.end(file);
            }
            else if(url.parse(request.url).pathname == '/api/faculties')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                Faculty.findAll()
                .then(data =>{response.end(JSON.stringify(data))})
                .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
            }
            else if(url.parse(request.url).pathname == '/api/pulpits')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                Pulpit.findAll()
                .then(data =>{response.end(JSON.stringify(data))})
                .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
            }
            else if(url.parse(request.url).pathname == '/api/subjects')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                Subjects.findAll()
                .then(data =>{response.end(JSON.stringify(data))})
                .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
            }
            else if(url.parse(request.url).pathname == '/api/teachers')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                Teacher.findAll()
                .then(data =>{response.end(JSON.stringify(data))})
                .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
            }
            else if(url.parse(request.url).pathname == '/api/auditoriumstypes')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                Auditorium_type.findAll()
                .then(data =>{response.end(JSON.stringify(data))})
                .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
            }
            else if(url.parse(request.url).pathname == '/api/auditoriums')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                Auditorium.findAll()
                .then(data =>{response.end(JSON.stringify(data))})
                .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
            }
            else if(url.parse(request.url).pathname.split('/')[2] == 'faculties' && url.parse(request.url).pathname.split('/')[4] == 'subjects')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                let faculty = decodeURI(url.parse(request.url).pathname.split('/')[3]);
                Faculty.findAll({
                    where:{
                        FACULTY : faculty
                    },
                    include:[
                        {model:Pulpit,required:true,
                        include:[{
                            model:Subjects,required:true
                        }]
                    }]
                    
                })
                .then(data =>{response.end(JSON.stringify(data))})
                .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
            }
            else if(url.parse(request.url).pathname.split('/')[2] == 'auditoriumtypes' && url.parse(request.url).pathname.split('/')[4] == 'auditoriums')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                let audit = decodeURI(url.parse(request.url).pathname.split('/')[3]);
                Auditorium_type.findAll({
                    where:{
                        AUDITORIUM_TYPE : audit
                    },
                    include:[
                        {model:Auditorium,required:true}]
                    
                })
                .then(data =>{response.end(JSON.stringify(data))})
                .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
            }
            else if(url.parse(request.url).pathname == '/api/auditoriums/scope')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                
                Auditorium.scope({method: ['auditoriumsCapacity', 10, 60]}).findAll()
                .then(table=>{response.end(JSON.stringify(table));})
                .catch(err=>{console.log(err); resp.end(JSON.stringify(err));})
            }
            else if(url.parse(request.url).pathname == '/api/trans')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED})
                .then(t => {
                    return Auditorium.update(
                        {AUDITORIUM_CAPACITY: 0}, 
                        {where: {AUDITORIUM_CAPACITY: {[Sequelize.Op.gte]: 0}},
                        transaction: t})
                        .then(table=>{response.end(JSON.stringify(table));})
                    .then((r) => {
                    setTimeout(() => {
                        return t.rollback()
                    }, 10000);
                })
                .catch((e) => {
                    console.log(e.message);
                    return t.rollback();
                });
                }
            )}
        }
        if(request.method == 'POST')
        {
            if(url.parse(request.url).pathname == '/api/faculties')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                var body = ' ';
                request.on('data',(chunk)=>{
                    body = chunk.toString();
                    body = JSON.parse(body);
                });
                request.on('end',()=>{
                    Faculty.create({
                        FACULTY:body.FACULTY,
                        FACULTY_NAME:body.FACULTY_NAME
                    })
                    .then(data =>{response.end(JSON.stringify(data))})
                    .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
                })
            }
            if(url.parse(request.url).pathname == '/api/pulpits')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                var body = ' ';
                request.on('data',(chunk)=>{
                    body = chunk.toString();
                    body = JSON.parse(body);
                });
                request.on('end',()=>{
                    Pulpit.create({
                        PULPIT: body.PULPIT,
                        PULPIT_NAME: body.PULPIT_NAME,
                        FACULTY: body.FACULTY
                    })
                    .then(data =>{response.end(JSON.stringify(data))})
                    .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
                })
            }
            if(url.parse(request.url).pathname == '/api/subjects')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                var body = ' ';
                request.on('data',(chunk)=>{
                    body = chunk.toString();
                    body = JSON.parse(body);
                });
                request.on('end',()=>{
                    Subjects.create({
                        SUBJECT: body.SUBJECT,
                        SUBJECT_NAME: body.SUBJECT_NAME,
                        PULPIT: body.PULPIT
                    })
                    .then(data =>{response.end(JSON.stringify(data))})
                    .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
                })
            }
            if(url.parse(request.url).pathname == '/api/teachers')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                var body = ' ';
                request.on('data',(chunk)=>{
                    body = chunk.toString();
                    body = JSON.parse(body);
                });
                request.on('end',()=>{
                    Teacher.create({
                        TEACHER: body.TEACHER,
                        TEACHER_NAME: body.TEACHER_NAME,
                        PULPIT: body.PULPIT
                    })
                    .then(data =>{response.end(JSON.stringify(data))})
                    .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
                })
            }
            if(url.parse(request.url).pathname == '/api/auditoriumstypes')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                var body = ' ';
                request.on('data',(chunk)=>{
                    body = chunk.toString();
                    body = JSON.parse(body);
                });
                request.on('end',()=>{
                    Auditorium_type.create({
                        AUDITORIUM_TYPE: body.AUDITORIUM_TYPE,
                        AUDITORIUM_TYPENAME: body.AUDITORIUM_TYPENAME
                    })
                    .then(data =>{response.end(JSON.stringify(data))})
                    .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
                })
            }
            if(url.parse(request.url).pathname == '/api/auditoriums')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                var body = ' ';
                request.on('data',(chunk)=>{
                    body = chunk.toString();
                    body = JSON.parse(body);
                });
                request.on('end',()=>{
                    Auditorium.create({
                        AUDITORIUM: body.AUDITORIUM,
                        AUDITORIUM_CAPACITY: body.AUDITORIUM_CAPACITY,
                        AUDITORIUM_NAME: body.AUDITORIUM_NAME,
                        AUDITORIUM_TYPE: body.AUDITORIUM_TYPE
                    })
                    .then(data =>{response.end(JSON.stringify(data))})
                    .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
                })
            }
        }
        if(request.method == 'PUT')
        {
            if(url.parse(request.url).pathname == '/api/faculties')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                var body = ' ';
                request.on('data',(chunk)=>{
                    body = chunk.toString();
                    body = JSON.parse(body);
                });
                request.on('end',()=>{
                    Faculty.update({
                        FACULTY: body.FACULTY,
                        FACULTY_NAME: body.FACULTY_NAME
                    },
                    {
                        where: {FACULTY: body.FACULTY}
                    }
                    )
                    .then(data =>{response.end(JSON.stringify(data))})
                    .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
                })
            }
            if(url.parse(request.url).pathname == '/api/pulpits')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                var body = ' ';
                request.on('data',(chunk)=>{
                    body = chunk.toString();
                    body = JSON.parse(body);
                });
                request.on('end',()=>{
                    Pulpit.update({
                        PULPIT: body.PULPIT,
                        PULPIT_NAME: body.PULPIT_NAME,
                        FACULTY: body.FACULTY
                    },
                    {
                        where: {PULPIT: body.PULPIT}
                    }
                    )
                    .then(data =>{response.end(JSON.stringify(data))})
                    .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
                })
            }
            if(url.parse(request.url).pathname == '/api/subjects')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                var body = ' ';
                request.on('data',(chunk)=>{
                    body = chunk.toString();
                    body = JSON.parse(body);
                });
                request.on('end',()=>{
                    Subjects.update({
                        SUBJECT: body.SUBJECT,
                        SUBJECT_NAME: body.SUBJECT_NAME,
                        PULPIT: body.PULPIT
                    },
                    {
                        where: {SUBJECT: body.SUBJECT}
                    }
                    )
                    .then(data =>{response.end(JSON.stringify(data))})
                    .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
                })
            }
            if(url.parse(request.url).pathname == '/api/teachers')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                var body = ' ';
                request.on('data',(chunk)=>{
                    body = chunk.toString();
                    body = JSON.parse(body);
                });
                request.on('end',()=>{
                    Teacher.update({
                        TEACHER: body.TEACHER,
                        TEACHER_NAME: body.TEACHER_NAME,
                        PULPIT: body.PULPIT
                    },
                    {
                        where: {TEACHER: body.TEACHER}
                    }
                    )
                    .then(data =>{response.end(JSON.stringify(data))})
                    .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
                })
            }
            if(url.parse(request.url).pathname == '/api/auditoriumstypes')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                var body = ' ';
                request.on('data',(chunk)=>{
                    body = chunk.toString();
                    body = JSON.parse(body);
                });
                request.on('end',()=>{
                    Auditorium_type.update({
                        AUDITORIUM_TYPE: body.AUDITORIUM_TYPE,
                        AUDITORIUM_TYPENAME: body.AUDITORIUM_TYPENAME
                    },
                    {
                        where: {AUDITORIUM_TYPE: body.AUDITORIUM_TYPE}
                    }
                    )
                    .then(data =>{response.end(JSON.stringify(data))})
                    .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
                })
            }
            if(url.parse(request.url).pathname == '/api/auditoriums')
            {
                response.writeHead(200,{"Content-type" : "application/json"});
                var body = ' ';
                request.on('data',(chunk)=>{
                    body = chunk.toString();
                    body = JSON.parse(body);
                });
                request.on('end',()=>{
                    Auditorium.update({
                        AUDITORIUM: body.AUDITORIUM,
                        AUDITORIUM_CAPACITY: body.AUDITORIUM_CAPACITY,
                        AUDITORIUM_NAME: body.AUDITORIUM_NAME,
                        AUDITORIUM_TYPE: body.AUDITORIUM_TYPE
                    },
                    {
                        where: {AUDITORIUM: body.AUDITORIUM}
                    }
                    )
                    .then(data =>{response.end(JSON.stringify(data))})
                    .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
                })
            }
        }
        if(request.method=='DELETE')
        {
            if(url.parse(request.url).pathname.split('/')[2] == 'faculties')
            {

                response.writeHead(200,{"Content-type" : "application/json"});
                var del = decodeURI(url.parse(request.url).pathname.split('/')[3]);
                Faculty.destroy({
                    where:{FACULTY : del}
                }
                )
                .then(data =>{response.end(JSON.stringify(data))})
                .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
            }
            if(url.parse(request.url).pathname.split('/')[2] == 'pulpits')
            {

                response.writeHead(200,{"Content-type" : "application/json"});
                var del = decodeURI(url.parse(request.url).pathname.split('/')[3]);
                Pulpit.destroy({
                    where:{PULPIT : del}
                }
                )
                .then(data =>{response.end(JSON.stringify(data))})
                .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
            }
            if(url.parse(request.url).pathname.split('/')[2] == 'subjects')
            {

                response.writeHead(200,{"Content-type" : "application/json"});
                var del = decodeURI(url.parse(request.url).pathname.split('/')[3]);
                Subjects.destroy({
                    where:{Subjects : del}
                }
                )
                .then(data =>{response.end(JSON.stringify(data))})
                .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
            }
            if(url.parse(request.url).pathname.split('/')[2] == 'teachers')
            {

                response.writeHead(200,{"Content-type" : "application/json"});
                var del = decodeURI(url.parse(request.url).pathname.split('/')[3]);
                Teacher.destroy({
                    where:{TEACHER : del}
                }
                )
                .then(data =>{response.end(JSON.stringify(data))})
                .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
            }
            if(url.parse(request.url).pathname.split('/')[2] == 'auditoriumstypes')
            {

                response.writeHead(200,{"Content-type" : "application/json"});
                var del = decodeURI(url.parse(request.url).pathname.split('/')[3]);
                Auditorium_type.destroy({
                    where:{AUDITORIUM_TYPE : del}
                }
                )
                .then(data =>{response.end(JSON.stringify(data))})
                .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
            }
            if(url.parse(request.url).pathname.split('/')[2] == 'auditoriums')
            {

                response.writeHead(200,{"Content-type" : "application/json"});
                var del = decodeURI(url.parse(request.url).pathname.split('/')[3]);
                Auditorium.destroy({
                    where:{AUDITORIUM : del}
                }
                )
                .then(data =>{response.end(JSON.stringify(data))})
                .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
            }
        }
    }).listen(3000)


})
.catch(err=>{console.log("error",err);});