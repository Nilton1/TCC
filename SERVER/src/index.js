// ./src/index.js
// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const redis = require('promise-redis-client');
const client = redis.createClient();


// const teste = async () => {
//     console.log("teste");
//     client.set('chave', 'valor');
//     const retorno = await client.get('chave');
//     console.log('Teste retorno');

// }

const retorna = async () => {
    //return await client.get('*');
    return await client.keys("*")
}

const retornaPesquisadores = async (nome) => {
    //return await client.get('*');
    let keys = await client.keys("colaborador*"+nome+"*")
    let nomes = await client.mget(keys)
    return [keys,nomes]
}

const Node = async (node) => {
    //return await client.get('*');
    //console.log(node)
    return await client.get(node)
}

const ListaGet = async (node1,node2) => {
    const return1 = await client.get(node1)
    const return2 = await client.get(node2)
    return await [return1,return2]
}

const ListaGetALL = async (NodeList,NodeList2) => {
    const return1 = await client.mget(NodeList)
    const return2 = await client.mget(NodeList2)
    return [return1.filter(n => n),return2.filter(n => n)]
}


// defining the Express app
const app = express();
// defining an array to work as the database (temporary solution)
const ads = [
    { title: 'Hello, world (again)!' }
];

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.get('/teste', (req, res) => {
    retorna().then(x => {
        res.send({'valor':x});
    })


});

app.get('/Node', (req, res) => {
    
    const varNode = req.query.Node
    console.log(varNode)
    retornaPesquisadores(varNode).then(x => {
        res.send(x.split("'").join('\"'));
    })


});

app.get('/Pesquisadores', (req, res) => {
    
    const varNome = req.query.Nome
    console.log(varNome)
    retornaPesquisadores(varNome).then(x => {
        res.send(x);
    })


});

app.get('/Ascendants', (req, res) => {
   //console.log(req.query)
   const varFirst = req.query.First
   const varSecond = req.query.Second
   console.log(varFirst)
   console.log(varSecond)
   ListaGet(varFirst,varSecond).then(x => {
       let resultado = JSON.parse("[]")
       if (x[0] !=null) {
           resultado = JSON.parse(x[0].split("'").join('\"'))
       }else{
           console.log("posicao zero null")
       }
       let listaBase = [varFirst]
       let resultado2 = JSON.parse("[]")
       if (x[1] !=null) {
           resultado2 = JSON.parse(x[1].split("'").join('\"'))
       }else{
           console.log("posicao um null")
       }
       
       let listaBase2 = [varSecond]
       listaBase = listaBase.concat(resultado.ascendant)
       console.log(listaBase)
       listaBase2 = listaBase2.concat(resultado2.ascendant)
       console.log(listaBase2)
       ListaGetALL(listaBase,listaBase2).then(all => {
           // resultado = all[0].map(function(item){
           //     return item.split("'").join('\"')
           // })
           // resultado1 = all[1].map(function(item){
           //     return item.split("'").join('\"')
           // })
           //console.log(all)
           if (x[0] ==null && x[1] ==null) {
               console.log("Retornando 1")
               res.send("[[],[]]");
           }else if (x[0] ==null) {
               console.log("Retornando 2")
               res.send(("[[],["+all[1].join(",")+"]]").split("'").join('\"'));
           }else if (x[1] ==null) {
               console.log("Retornando 3")
               res.send(("[["+all[0].join(",")+"],[]]").split("'").join('\"'));
           }else{
               console.log("Retornando 4")
               res.send(("[["+all[0].join(",")+"],["+all[1].join(",")+"]]").split("'").join('\"'));
           }
           
       })
       
   })


});

app.get('/Descendants', (req, res) => {
    //console.log(req.query)
    const varFirst = req.query.First
    const varSecond = req.query.Second
    console.log(varFirst)
    console.log(varSecond)
    ListaGet(varFirst,varSecond).then(x => {
        let resultado = JSON.parse("[]")
        if (x[0] !=null) {
            resultado = JSON.parse(x[0].split("'").join('\"'))
        }else{
            console.log("posicao zero null")
        }
        let listaBase = [varFirst]
        let resultado2 = JSON.parse("[]")
        if (x[1] !=null) {
            resultado2 = JSON.parse(x[1].split("'").join('\"'))
        }else{
            console.log("posicao um null")
        }
        
        let listaBase2 = [varSecond]
        listaBase = listaBase.concat(resultado.descendant)
        console.log(listaBase)
        listaBase2 = listaBase2.concat(resultado2.descendant)
        console.log(listaBase2)
        ListaGetALL(listaBase,listaBase2).then(all => {
            // resultado = all[0].map(function(item){
            //     return item.split("'").join('\"')
            // })
            // resultado1 = all[1].map(function(item){
            //     return item.split("'").join('\"')
            // })
            //console.log(all)
            if (x[0] ==null && x[1] ==null) {
                console.log("Retornando 1")
                res.send("[[],[]]");
            }else if (x[0] ==null) {
                console.log("Retornando 2")
                res.send(("[[],["+all[1].join(",")+"]]").split("'").join('\"'));
            }else if (x[1] ==null) {
                console.log("Retornando 3")
                res.send(("[["+all[0].join(",")+"],[]]").split("'").join('\"'));
            }else{
                console.log("Retornando 4")
                res.send(("[["+all[0].join(",")+"],["+all[1].join(",")+"]]").split("'").join('\"'));
            }
            
        })
        
    })


});

// starting the server
app.listen(3001, () => {
    console.log('listening on port 3001');
});