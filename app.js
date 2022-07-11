//jshint esversion:6
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
let APP_PWD = process.env.APP_PWD;
              
const dbURI = `mongodb+srv://eisenhardt:${APP_PWD}@corso-node.vkhzh.mongodb.net/blog2?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(dbURI, {useUnifiedTopology : true, useNewUrlParser : true});
let blogDB2, articoliCollection2;

//   {
//   path : `.env.${app.get("env")}`
// });

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
let posts = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json())
app.use(express.static("public"));

app.get("/", async (req, res)=>{
    const ris = await articoliCollection2.find({});
    if (ris.length == 0) {
      articoliCollection2.insertOne(homeStartingContent)
    }
    posts = await ris.toArray();
    res.render("home", {startingContent : homeStartingContent, posts : posts});
})

app.get("/about", async (req, res)=>{
  const ris = await articoliCollection2.find({});
  if (ris.length == 0) {
      articoliCollection2.insertOne(aboutContent);
  }
  res.render("about", {abtContent : aboutContent})
})

app.get("/contact", async (req, res)=>{
  const ris = await articoliCollection2.find({});
  if (ris.length == 0) {
      articoliCollection2.insertOne(contactContent);
  }
  res.render("contact", {cntContent : contactContent})
})

app.get("/compose", (req, res)=>{
  res.render("compose")
})

app.post("/compose", async (req, res)=>{
  const post = { 
    title : req.body.postTitle,
    content : req.body.postBody
  }
  posts.push(post);
  await articoliCollection2.insertOne(post);
  res.redirect("/")
})

app.get("/:postTitle", async (req,res)=>{
  let titleParam = _.lowerCase(req.params.postTitle);
  const articoli = await articoliCollection2.find({}).toArray();
  articoli.forEach(p => {
    let titleFound = p.title;
    let contentFound = p.content;
      if (_.lowerCase(p.title) == titleParam) {
        res.render("post", { titleFound : titleFound, contentFound : contentFound });
        console.log("Match found");
      }
  });
  res.send();
})

app.post("/delete", async (req, res)=>{
  let valueForm = req.body.delContent;
  await articoliCollection2.deleteOne({ title : valueForm }); 
  res.redirect("/");
})


const port = process.env.PORT || 3000;

async function run(){
  await mongoClient.connect();
  console.log("... Siamo connessi a MongoDB Atlas ...");
  app.listen(port, ()=>{
    console.log(`... Server in ascolto sulla porta ${port} ...`);
  })
  blogDB2 = mongoClient.db("blog2");
  articoliCollection2 = blogDB2.collection("articoli2")}

run().catch((err) => console.log(`Errore di connessione: ${err}`));