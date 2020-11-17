const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function ValidateRepositoryID (request,response,next) {
    const {id} = request.params;

    if(!isUuid(id)) {
      return response.status(404).json({error: 'Erro de permissão!'});
    }

    return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title,url,techs} = request.body;

  const repository  = {
    id,
    title, 
    url,
    techs,
    likes: 0     
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", ValidateRepositoryID, (request, response) => {
   const {id} = request.params;
   const {title,url,techs} = request.body;

   const {repositoryIndex} = repository.findIndex(repository => repository.id == id);

   if(repositoryIndex < 0) {
     return response.status(400).json({erro: 'Erro de autenticação!'});
   }

   const repository = {
     id,
     title,
     url,
     techs
   }

   repositories[repositoryIndex] = repository;

   return response.json(repository);

});

app.delete("/repositories/:id", ValidateRepositoryID, (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repository.findIndex(repository => repository.id == id);

  if(!repositoryIndex) {
    return response.status(400).send();
  }

  if(repositoryIndex < 0) {
    return response.status(204).json({error: 'Erro de autenticação!'});
  }

  repositories.splice(repositoryIndex,1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", ValidateRepositoryID, (request, response) => {
  const {id} = request.params;

  const repository = repositories.find(repository => repository.id == id);

  if(!repository){
    return response.status(400).send();
  }

  repository.likes += 1;

  return response.json(repository);
});

console.log("Back-end Started!");

module.exports = app;
