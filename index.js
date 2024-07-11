require('dotenv').config()
const http = require('http')
const {app} = require('./server');
const {connectDB} = require('./src/db/index')


const server = http.createServer(app);
app.get('/', (req, res)=>{res.send({"kanak": "hii"})});

connectDB().then(()=>{
  console.log("connected");
}).catch(()=>{
    console.log("error");
})


// console.log(process.env)
let port = process.env.PORT || 3000 ;
server.listen( port, () =>{
    console.log(`port started: ${port}`);
})