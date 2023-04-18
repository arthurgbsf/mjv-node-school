<h2> liftLog-TrainUp</h1>


<h2> O Projecto</h2>

<p> O LiftLog-TrainUp é um simples aplicativo onde o usuário pode cadastrar e editar treinos e exercíos de musculação e compartilha-los com os usuários. O usuário somente pode editar seus treinos e exercícios crias<p/>

<hr>

## Inicializar o Projeto

```bash
$ npm install
$ npm run start-dev
 
<br></br>

### Rotas

## Rotas do Usuário (User)

| Método |    Endpoint           |          Descrição                     | 
| ------ | ----------------------| ---------------------------------------| 
| GET    | /users                |  Lista todos os usuários               |  
| GET    | /users/profile        |  Retorna o perfil do usuário           |  
| POST   | /users/new            |  Cadastra um usuário                   |
| POST   | /users/authentication |  Gera a autenticação do usuário        |
| PUT    | /users/update         |  Altera os dados do usuário            | 
| DELETE | /users/delete         |  Deleta  a conta do usuário            | 

<p></p>

## Rotas do Treino (Workout)

| Método |  Endpoint                     |  Descrição                                                   | 
| ------ | ------------------------------| -------------------------------------------------------------| 
| GET    | /workouts                     |  Lista todos treinos cadastrados                             |  
| GET    | /workouts/:id                 |  Retorna o treino do id passado como parâmetro               |  
| POST   | /workouts/new                 |  Cadastra um treino                                          |
| PUT    | /workouts/update/:id          |  Atualiza o treino passado como parâmetro                    |
| PUT    | /workouts/update/exercise/:id |  Adiciona um novo exercício ao treino passado como parâmetro | 
| DELETE | /workouts/delete/:id          |  Deleta o exercício do id passado como parâmetro             | 

 <br></br>

## Rotas do Exercício (Exercise)

| Método |  Endpoint                     |  Descrição                                                   | 
| ------ | ------------------------------| -------------------------------------------------------------| 
| GET    | /exercises                    |  Lista todos exercícios cadastrados                          |  
| GET    | /exercises/:id                |  Retorna o exercício do id passado como parâmetro            |  
| POST   | /exercises/new                |  Cadastra um novo exercício                                  |
| PUT    | /exercises/update/:id         |  Atualiza o exercício do id passado como parâmetro           | 
| DELETE | /exercises/delete/:id         |  Deleta o exercício do id passado como parâmetro             | 


## Bibliotecas Utilizadas

| -------------- | ------------  |
| `JavaScript`   | `dotenv`      |
| `TypeScript`   | `jsonwebtoken`|
| `MongoDB`      | `bcryptjs`    |
| `Mongoose`     | `cors`        |    
| `Nodejs`       | `Express`     |
| `Moment`       |               |

<br></br>
