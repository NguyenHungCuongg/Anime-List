import express from "express"
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({ extended: true }));

let FilterAPI =  "https://kitsu.io/api/edge/trending/anime";
let Category = "Trending";
let Order = "Ascending";   
let SearchAnime = "";

app.get("/",async (req,res)=>{
  Category = "Trending";
  Order = "Ascending";
  try{
    const response = await axios.get(FilterAPI);
    let List = response.data.data;  
    List.sort((a, b) => b.attributes.everageRating - a.attributes.everageRating);
    res.render("index.ejs", {animeList: List, Category: Category, Order: Order, Search: "none"});
  }
  catch(error){
    console.log(error.response.data); 
  }
})

app.post("/",async (req,res)=>{
  Order = req.body.order;
  Category = req.body.category;
  if(Category==="Trending") FilterAPI = "https://kitsu.io/api/edge/trending/anime";
  else {FilterAPI = `https://kitsu.io/api/edge/anime?filter[categories]=${Category}`;}
  try{
    const response = await axios.get(FilterAPI);
    let List = response.data.data;
    List.sort((a, b) => b.attributes.averageRating - a.attributes.averageRating);
    res.render("index.ejs", {animeList: List, Category: Category, Order: Order, Search: "none"});
  }
  catch(error){
    console.log(error.response.data); 
  }
})

app.get("/search",async(req,res)=>{
  SearchAnime = req.query.search;
  const SearchAPI = `https://kitsu.io/api/edge/anime?filter[text]=${SearchAnime}`;
  try{
    const response = await axios.get(SearchAPI);
    let List = response.data.data;
    res.render("index.ejs", {animeList: List,Category: "Unknown", Order: "Unknown", Search: SearchAnime});
  }
  catch(error){
    console.log(error.response.data);
  }
})

app.listen(port,()=>{
  console.log("Server is running on port: " + port);
})