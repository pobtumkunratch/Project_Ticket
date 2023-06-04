const express = require('express');
const app = express();
const mysql = require('mysql');
const  lod = require('lodash');
const bodypaser = require('body-parser');
const res = require('express/lib/response');
const req = require('express/lib/request');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

const server = app.listen(3000,() => {
    console.log('Nodejs is running on port 3000!')
})
const dbticket = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:"project_ticket"
});

dbticket.connect(function(err) {
  if (err) throw err;
  console.log("Connected complete!");
});

//Api Create
app.post('/api/proticket',(req , res) => {
    var Subjecttic = lod.get(req,['body','Subject']);
    var Contenttic = lod.get(req,['body','Content']);
    var Contacttic = lod.get(req,['body','Contact']);
    var datetimeCreate = lod.get(req,['body','Createtime']);
    var datetimeUpdate = lod.get(req,['body','Updatetime']);
    var tic_Status = lod.get(req,['body','Status']);
    

    try {
        
        if (Subjecttic && Contacttic && Contenttic && datetimeCreate  && tic_Status) {
            dbticket.query('insert into ticket (Subject,Content,Contact,Createtime,Status) values (?,?,?,?,?)',[
                Subjecttic,Contenttic,Contacttic,datetimeCreate,tic_Status
            ], (err, resp,field) =>{
                if(resp){
                    return res.status(200).json({
                        RespCode:200,
                        RespMessage:'Success : Insert Complete',
                        Log: 2
                    })
                }else{
                    console.log('Error : Insert fail Invalid request');
                    console.log(err);
                    console.log(field);
                    return res.status(200).json({
                        RespCode:400,
                        RespMessage:'Error : Insert fail Invalid request',
                        Log: 2
                    })
                }
            }
            )
        } else {
            console.log('Error Object : Invalid request')
            return res.status(200).json({
                RespCode:400,
                RespMessage:'fail Invalid request',
                Log: 1
            })
        }
        
    } catch (error) {
        console.log('Error Object 0! : ',error);
        return res.status(200).json({
            RespCode:400,
            RespMessage:'fail Data Object',
            Log: 0
        })
    }
})

//Api GET_Data
app.get('/api/getticket',(req,res) =>{
    try {
        dbticket.query('select ticketid,Subject,Content,Contact,Createtime,Updatetime,Status from ticket order by Createtime desc,Updatetime desc', [],
        (err,data,fit) =>{
            if (data && data[0]) {
                    return res.status(200).json({
                    RespCode:200,
                    RespMessage:'Success ',
                    Result:data,
                })
            } else {
                console.log('Error request : Not found data');
                console.log(err);
                console.log(fit);
                return res.status(200).json({
                RespCode:400,
                RespMessage:'Not found Data',
                Log: 1
                })
            }
        })
    } catch (error) {
        console.log('Error Object 0! : ',error);
        return res.status(200).json({
            RespCode:400,
            RespMessage:'fail Data Object',
            Log: 0
        })
    }
})

//Api Update_put
app.put('/put/updatetic',(req,res) =>{
    var tic_id = lod.get(req,['body','ticketid']);
    var Subjecttic = lod.get(req,['body','Subject']);
    var Contenttic = lod.get(req,['body','Content']);
    var Contacttic = lod.get(req,['body','Contact']);
    var datetimeCreate = lod.get(req,['body','Createtime']);
    var datetimeUpdate = lod.get(req,['body','Updatetime']);
    var tic_Status = lod.get(req,['body','Status']);

    try {
        if (tic_id && datetimeUpdate && tic_Status) {
            dbticket.query('update ticket set Subject = ?,Content = ? , Contact = ? , Updatetime = ? ,Status = ? where ticketid = ?',[Subjecttic,Contenttic,Contacttic,datetimeUpdate,tic_Status,parseInt(tic_id)],
            (err,data,fil) => {
                if (data) {
                    return res.status(200).json({
                        RespCode:200,
                        RespMessage:'Success',
                    })
                } else {
                    console.log('Error request : Update Fail');
                    console.log(err);
                    console.log(fil);
                    return res.status(200).json({
                    RespCode:400,
                    RespMessage:'Cannot Updata Data',
                    Log: 2
                })
                }
            })
        } else {
                console.log('Error request : Invaild Data');
                return res.status(200).json({
                RespCode:400,
                RespMessage:'Invaild Data',
                Log: 1
                })
        }
        
    } catch (error) {
        console.log('Error Object 0! : ',error);
        return res.status(200).json({
            RespCode:400,
            RespMessage:'fail Data Object',
            Log: 0
    })
}
})

//Api Delete 
app.delete('/api/deleteTic',(req,res) =>{
    var tic_id = lod.get(req,['body','ticketid']);

    try {
        if (tic_id) {
            dbticket.query('delete from ticket where ticketid = ?',[parseInt(tic_id)],
            (err,resq,fil) => {
                if (resq) {
                    return res.status(200).json({
                    RespCode:200,
                    RespMessage:'delete Data id Success',
                    })
                } else {
                    console.log('Error request : fail delete Data id');
                    return res.status(200).json({
                    RespCode:400,
                    RespMessage:'fail delete Data id',
                    Log: 2
                })
                }
            })
        } else {
            console.log('Error request : Invaild Data id');
                return res.status(200).json({
                RespCode:400,
                RespMessage:'Invaild Data id',
                Log: 1
                })
        }
    } catch (error) {
        console.log('Error Object 0! : ',error);
        return res.status(200).json({
            RespCode:400,
            RespMessage:'fail Data Object',
            Log: 0
        })
    }
})

module.exports = app;