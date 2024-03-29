
/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Yash Prakashkumar Patel    Student ID: 130761216 Date: 17- 01 2023
*  Cyclic Link: https://zany-puce-xerus-yoke.cyclic.app/
*
********************************************************************************/ 

const express = require("express");
const app = express();
const cors = require("cors");
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
require('dotenv').config(); 
app.use(cors());
app.use(express.json())
const HTTP_PORT = process.env.PORT || 8080;


app.get('/', (req, res) => {
    res.json({ message: "app is listening" });
});

app.post('api/movies',(req,res)=>{
    db.addNewMovie(req.body).then(()=>{
        res.status(201).send(" New movies added");
    }).catch((err)=>{         
        res.status(500).json({ errorMessage: "Unable to Add Movie" });
    }) 
}) 

app.get('/api/movies/', (req, res) => {
    db.getAllMovies(req.query.page,        
        req.query.perPage,        
        req.query.title
          ).then((movies) => {
        res.status(200).json(movies);
    }).catch((err) => {
        res.status(500).send(err);
    })
  });
  
  app.get('/api/movies/:id', (req, res) => {
    db.getMovieById(req.params.id).then((movie) => {
        if (movie)
        res.status(200).json(movie);
        else
        res.json({errorMessage: "movie not found"})
    }).catch((err) => {
        res.status(204).send(err);
    })
  });
  
  app.put('/api/movie/:id', (req, res) => {
    db.updateMovieById(req.body, req.params.id).then(() => {
        res.status(200).send('Movie updated successfully');
    }).catch((err) => {
        res.status(500).send(err);
    })
  });
  
  app.delete('/api/movies/:id', (req, res) => {
    db.deleteMovieById(req.params.id).then(() => {
        res.status(200).send("Movie deleted :" + req.params.id);
    }).catch((err) => {
        res.status(500).send(err);
    })
  });

  app.use((req, res) => {
    res.status(404).send("Resource not found");
  });
  
  

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});

