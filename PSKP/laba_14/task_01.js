import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import http from "http";
import url from "url";
import fs from "fs";


http.createServer((request,response) =>{
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
            prisma.FACULTY.findMany()
            .then(data =>{response.end(JSON.stringify(data))})
            .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
        }
        else if(url.parse(request.url).pathname == '/api/pulpits')
        {
            response.writeHead(200,{"Content-type" : "application/json"});
            prisma.PULPIT.findMany()
            .then(data =>{response.end(JSON.stringify(data))})
            .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
        }
        else if(url.parse(request.url).pathname == '/api/subjects')
        {
            response.writeHead(200,{"Content-type" : "application/json"});
            prisma.SUBJECT.findMany()
            .then(data =>{response.end(JSON.stringify(data))})
            .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
        }
        else if(url.parse(request.url).pathname == '/api/teachers')
        {
            response.writeHead(200,{"Content-type" : "application/json"});
            prisma.TEACHER.findMany()
            .then(data =>{response.end(JSON.stringify(data))})
            .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
        }
        else if(url.parse(request.url).pathname == '/api/auditoriumstypes')
        {
            response.writeHead(200,{"Content-type" : "application/json"});
            prisma.AUDITORIUM_TYPE.findMany()
            .then(data =>{response.end(JSON.stringify(data))})
            .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
        }
        else if(url.parse(request.url).pathname == '/api/auditoriums')
        {
            response.writeHead(200,{"Content-type" : "application/json"});
            prisma.AUDITORIUM.findMany()
            .then(data =>{response.end(JSON.stringify(data))})
            .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
        }
        else if(url.parse(request.url).pathname.split('/')[2] == 'faculties' && url.parse(request.url).pathname.split('/')[4] == 'subjects')
        {
            response.writeHead(200,{"Content-type" : "application/json"});
            let code = decodeURI(url.parse(request.url).pathname.split('/')[3]);
            prisma.FACULTY.findMany({
                where:{
                    FACULTY : code
                },
                select:{
                    FACULTY: true,
                    PULPIT_PULPIT_FACULTYToFACULTY:{
                        select:{
                            PULPIT:true,
                            SUBJECT_SUBJECT_PULPITToPULPIT:{
                                select:{
                                    SUBJECT:true
                                }
                            }
                        }
                    }
                }}
                
            )
            .then(data =>{response.end(JSON.stringify(data))})
            .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
        }
        else if(url.parse(request.url).pathname.split('/')[2] == 'auditoriumtypes' && url.parse(request.url).pathname.split('/')[4] == 'auditoriums')
        {
            response.writeHead(200,{"Content-type" : "application/json"});
            let code = decodeURI(url.parse(request.url).pathname.split('/')[3]);
            prisma.AUDITORIUM_TYPE.findMany({
                where:{
                    AUDITORIUM_TYPE: code
                },
                select:{
                    AUDITORIUM_TYPE: true,
                    AUDITORIUM_AUDITORIUM_AUDITORIUM_TYPEToAUDITORIUM_TYPE: {
                    select:{
                        AUDITORIUM: true
                    }}
                }
            })
            .then(data =>{response.end(JSON.stringify(data))})
            .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
        }
        else if(url.parse(request.url).pathname == '/api/auditoriumsWithComp1')
        {
            response.writeHead(200,{"Content-type" : "application/json"});
            
            prisma.AUDITORIUM.findMany({
                where:{
                    AUDITORIUM_TYPE: "ЛБ-К",
                    AUDITORIUM:{
                        contains: "-1"
                    }
                }
            })
            .then(table=>{response.end(JSON.stringify(table));})
            .catch(err=>{console.log(err); resp.end(JSON.stringify(err));})
        }
        else if(url.parse(request.url).pathname == '/api/puplitsWithoutTeachers')
        {
            response.writeHead(200,{"Content-type" : "application/json"});
            prisma.PULPIT.findMany({
                where:{
                    TEACHER_TEACHER_PULPITToPULPIT: {
                        none: {}
                    }
                }
            })
            .then(data=>{console.log(data);response.end(JSON.stringify(data))})
            .catch(e=>response.end(JSON.stringify(e)))
        }
        else if(url.parse(request.url).pathname == '/api/pulpitsWithVladimir')
        {
            response.writeHead(200,{"Content-type" : "application/json"});
            
            prisma.PULPIT.findMany({
                where:{
                    TEACHER_TEACHER_PULPITToPULPIT: {
                            some: {
                                TEACHER_NAME:{
                                contains: "Владимир"
                                }
                            }
                    }
                },
            })
            .then(table=>{response.end(JSON.stringify(table));})
            .catch(err=>{console.log(err); resp.end(JSON.stringify(err));})
        }
        else if(url.parse(request.url).pathname == '/api/auditoriumsSameCount')
        {
            response.writeHead(200,{"Content-type" : "application/json"});
            
            prisma.AUDITORIUM.groupBy({
                by: [
                    "AUDITORIUM_TYPE",
                    "AUDITORIUM_CAPACITY"
                ],
                _count: true
            })
            .then(table=>{response.end(JSON.stringify(table));})
            .catch(err=>{console.log(err); resp.end(JSON.stringify(err));})
        }
        else if(url.parse(request.url).pathname.split('/')[2] == 'page' )
        {
            let code=decodeURI(url.parse(request.url).pathname.split("/")[3]);
            if (code == 1) {
                prisma.PULPIT.findMany({
                    take: 10,
                    include: {
                        _count: {
                            select: {
                                TEACHER_TEACHER_PULPITToPULPIT: true,
                            },
                            },
                    },
                })
                .then(result => {
                    response.end(JSON.stringify(result));
                });
            } else {
                prisma.PULPIT.findMany({
                    take: 10,
                    skip: 10 * code - 10,
                    include: {
                        _count: {
                            select: {
                                TEACHER_TEACHER_PULPITToPULPIT: true,
                            },
                        },
                    },
                })
                .then(result => {
                    response.end(JSON.stringify(result));
                });
            }
        }
        else if(url.parse(request.url).pathname == '/api/fluentapi')
        {
            response.writeHead(200,{"Content-type" : "application/json"});
            prisma.FACULTY.findUnique({
                where:{ FACULTY:'ИЭФ'}}).PULPIT_PULPIT_FACULTYToFACULTY()
            .then(data=>{console.log(data);response.end(JSON.stringify(data))})
            .catch(e=>response.end(JSON.stringify(e)))
        }
        else if(url.parse(request.url).pathname == '/api/transaction')
        {
            response.writeHead(200,{"Content-type" : "application/json"});
            prisma.$transaction(
                async(tx) =>{
                    await  tx.$executeRaw `UPDATE AUDITORIUM set auditorium_capacity += 100;`

                    await prisma.AUDITORIUM.findMany()
                    .then(data=>{console.log(data);response.end(JSON.stringify(data))})
                    .catch(e=>response.end(JSON.stringify(e)))
                    throw new Error('some error');
                },
                {
                    isolatioLevel: Prisma.TransactionIsolationLevel.Serializable,
                    TIMEOUT: 10000,
                    maxWait: 5000,
                }
            )
            .then(data=>{console.log(data);response.end(JSON.stringify(data))})
            .catch(e=>response.end(JSON.stringify(e)))
        }
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
                prisma.FACULTY.create({
                    data:{
                        FACULTY: body.FACULTY,
                        FACULTY_NAME: body.FACULTY_NAME
                    }
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
                prisma.PULPIT.create({
                    data:{
                    PULPIT: body.PULPIT,
                    PULPIT_NAME: body.PULPIT_NAME,
                    FACULTY: body.FACULTY
                    }
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
                prisma.SUBJECT.create({
                    data:{
                    SUBJECT: body.SUBJECT,
                    SUBJECT_NAME: body.SUBJECT_NAME,
                    PULPIT: body.PULPIT
                    }
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
                prisma.TEACHER.create({
                    data:{
                    TEACHER: body.TEACHER,
                    TEACHER_NAME: body.TEACHER_NAME,
                    PULPIT: body.PULPIT
                    }
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
                prisma.AUDITORIUM_TYPE.create({
                    data:{
                    AUDITORIUM_TYPE: body.AUDITORIUM_TYPE,
                    AUDITORIUM_TYPENAME: body.AUDITORIUM_TYPENAME
                    }
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
                prisma.AUDITORIUM.create({
                    data:{
                    AUDITORIUM: body.AUDITORIUM,
                    AUDITORIUM_CAPACITY: body.AUDITORIUM_CAPACITY,
                    AUDITORIUM_NAME: body.AUDITORIUM_NAME,
                    AUDITORIUM_TYPE: body.AUDITORIUM_TYPE
                    }
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
                prisma.FACULTY.update({
                    where: {
                        FACULTY: body.FACULTY
                    },
                    data:{
                        FACULTY_NAME: body.FACULTY_NAME
                    }
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
                prisma.PULPIT.update({
                    where: {
                        PULPIT: body.PULPIT
                    },
                    data:{
                        PULPIT_NAME: body.PULPIT_NAME,
                        FACULTY: body.FACULTY
                    }
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
                prisma.SUBJECT.update({
                    where:{
                        SUBJECT: body.SUBJECT
                    },
                    data:{
                        SUBJECT_NAME: body.SUBJECT_NAME,
                        PULPIT: body.PULPIT
                    }
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
                prisma.TEACHER.update({
                    where:{
                        TEACHER: body.TEACHER
                    },
                    data:{
                        TEACHER_NAME: body.TEACHER_NAME,
                        PULPIT: body.PULPIT
                    }
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
                prisma.AUDITORIUM_TYPE.update({
                    where:{
                        AUDITORIUM_TYPE: body.AUDITORIUM_TYPE
                    },
                    data:{
                        AUDITORIUM_TYPENAME: body.AUDITORIUM_TYPENAME
                    }
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
                prisma.AUDITORIUM.update({
                    where:{
                        AUDITORIUM: body.AUDITORIUM
                    },
                    data:{
                        AUDITORIUM_NAME: body.AUDITORIUM_NAME,
                        AUDITORIUM_CAPACITY: body.AUDITORIUM_CAPACITY,
                        AUDITORIUM_TYPE: body.AUDITORIUM_TYPE
                    }
                })
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
            prisma.FACULTY.delete({
                where: {FACULTY: del}
            })
            .then(data =>{response.end(JSON.stringify(data))})
            .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
        }
        if(url.parse(request.url).pathname.split('/')[2] == 'pulpits')
        {

            response.writeHead(200,{"Content-type" : "application/json"});
            var del = decodeURI(url.parse(request.url).pathname.split('/')[3]);
            prisma.PULPIT.delete({
                where: {PULPIT: del}
            })
            .then(data =>{response.end(JSON.stringify(data))})
            .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
        }
        if(url.parse(request.url).pathname.split('/')[2] == 'subjects')
        {

            response.writeHead(200,{"Content-type" : "application/json"});
            var del = decodeURI(url.parse(request.url).pathname.split('/')[3]);
            prisma.SUBJECT.delete({
                where: {SUBJECT: del}
            })
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
            prisma.AUDITORIUM_TYPE.delete({
                where: {AUDITORIUM_TYPE: del}
            })
            .then(data =>{response.end(JSON.stringify(data))})
            .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
        }
        if(url.parse(request.url).pathname.split('/')[2] == 'auditoriums')
        {

            response.writeHead(200,{"Content-type" : "application/json"});
            var del = decodeURI(url.parse(request.url).pathname.split('/')[3]);
            prisma.AUDITORIUM.delete({
                where: {AUDITORIUM: del}
            })
            .then(data =>{response.end(JSON.stringify(data))})
            .catch(err=>{console.log(err);response.end(JSON.stringify(err))})
        }
    }

}).listen(5000)