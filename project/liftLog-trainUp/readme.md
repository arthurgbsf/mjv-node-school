<h1> liftLog-TrainUp</h1>


<h2> O Projecto</h2>

<p> O LiftLog-TrainUp é um simples aplicativo onde o usuário pode cadastrar e editar treinos e exercíos de musculação e compartilha-los com os usuários. O usuário somente pode editar seus treinos e exercícios criados<p/>

<hr>

## Inicializar o Projeto

```bash
$ npm install
$ npm run start-dev
```
<br></br>

## Rotas

### Rotas do Usuário (User)

| Método |    Endpoint           |          Descrição                     | 
| ------ | ----------------------| ---------------------------------------| 
| GET    | /users                |  Lista todos os usuários               |  
| GET    | /users/profile        |  Retorna o perfil do usuário           |  
| POST   | /users/new            |  Cadastra um usuário                   |
| POST   | /users/authentication |  Gera a autenticação do usuário        |
| PUT    | /users/update         |  Altera os dados do usuário            | 
| DELETE | /users/delete         |  Deleta  a conta do usuário            | 
 
 <br></br>
 
### Rotas do Treino (Workout)

| Método |  Endpoint                     |  Descrição                                                   | 
| ------ | ------------------------------| -------------------------------------------------------------| 
| GET    | /workouts                     |  Lista todos treinos cadastrados                             |  
| GET    | /workouts/:id                 |  Retorna o treino do id passado como parâmetro               |  
| POST   | /workouts/new                 |  Cadastra um treino                                          |
| PUT    | /workouts/update/:id          |  Altera um treino cadastrado pelo próprio usuário            | 
| DELETE | /workouts/delete/:id          |  Deleta o treino do id passado como parâmetro                | 
 
 <br></br>
 
### Bibliotecas Utilizadas

|                |               |
| -------------- | ------------  |
| `JavaScript`   | `dotenv`      |
| `TypeScript`   | `jsonwebtoken`|
| `MongoDB`      | `bcryptjs`    |
| `Mongoose`     | `cors`        |    
| `Nodejs`       | `Express`     |
| `Moment`       |               |

<br></br>
