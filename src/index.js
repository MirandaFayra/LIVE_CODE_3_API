import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3333

let pessoasBibliotecarias =[]
let registroAutomatizado = 1


//--------------- CRIAR PESSOA BIBLIOTECÁRIA ----------------

app.post('/bibliotecaria',async(request, response)=>{
    const {nome, senha} = request.body

    if(!nome){
        response.status(400).send(JSON.stringify({ Mensagem: "Favor enviar um nome válido" }))
    }

    if(!senha){
        response.status(400).send(JSON.stringify({ Mensagem: "Favor enviar uma senha válida" }))
    }

    if(nome && senha){ 

        const senhaCriptografada = await bcrypt.hash(senha,10)

        let novaPessoaBibliotecaria = {
            registro : registroAutomatizado,
            nome, 
            senha : senhaCriptografada
        }

        pessoasBibliotecarias.push(novaPessoaBibliotecaria) 

        registroAutomatizado++

        response.status(201).send(JSON.stringify({ Mensagem: `Pessoa bibliotecária cadastrada com sucesso!. Seu número de registro é ${novaPessoaBibliotecaria.registro}` }))

    }else{
        response.status(500).send(JSON.stringify({ Mensagem: "Erro interno. Não foi possível realizar a operação " }))
    }
})

//--------------- LER PESSOA BIBLIOTECÁRIA ------------------

app.get('/bibliotecaria/:registro',(request, response)=>{
    const registro = Number(request.params.registro)

    if(!registro){
        response.status(400).send(JSON.stringify({ Mensagem: "Favor enviar um número de resgistro para consultar a pessoa bibliotecária" }))
    }

    const verificarRegistro = pessoasBibliotecarias.find((pessoa)=> pessoa.registro === registro)

    if(!verificarRegistro){
        response.status(400).send(JSON.stringify({ Mensagem: "Registro não encontrado no nosso banco de dados. Verifique se passou um registro válido" }))
    }

    if(verificarRegistro){
        let nomeEncontrado = verificarRegistro.nome
        response.status(200).send(JSON.stringify({ Mensagem: `A pessoa bibliotecária com esse registro é ${nomeEncontrado}` }))
    }else{
        response.status(500).send(JSON.stringify({ Mensagem: "Erro interno. Não foi possível realizar a operação " }))
    }
})

//--------------- LOGAR PESSOA BIBLIOTECÁRIA -------------

app.post('/login-biblioteca',async(request, response) => {
    const {nome, senha} = request.body 

    if(!nome){
        response
        .status(400)
        .send(JSON.stringify({ Mensagem: "Favor inserir um nome válido" }))
    }
    
    if(!senha){
        response
        .status(400)
        .send(JSON.stringify({ Mensagem: "Favor inserir uma senha válida" }))
    }

    const verificarNome = pessoasBibliotecarias.find((nomeBuscado)=> nomeBuscado.nome === nome)

    if(!verificarNome){
        response
        .status(400)
        .send(JSON.stringify({ Mensagem: "Nome não encontrado em nosso banco de dados" }))
    }

    if(verificarNome){
        const senhaCompativel = await bcrypt.compare(senha,verificarNome.senha)

        if(senhaCompativel){
            response
            .status(200)
            .send(JSON.stringify({ Mensagem: `Pessoa bibliotecária com o nome ${nome}, logada com sucesso!` }))
        }else{
            response
            .status(400)
            .send(JSON.stringify({ Mensagem: "Credenciais inválidas" }))
        }
    }

})

//--------------- ATUALIZAR PESSOA BIBLIOTECÁRIA --------------

/* 
    CRIE UM ENDPOINT PARA ATUALIZAR A PESSOA USUÁRIA . ESSE ENDPOINT DEVE CONTER OS SEGUINTES REQUISITOS : 

    - Nome , passado pela pessoa usuária ;
    - Senha , passada pela a pessoa usuária;
    - Devemos atualizar uma pessoa pelo seu registro. Que será um número 
    - O registro que nos permitirá verificar se essa pessoa se encontra no nosso banco 
    - Caso encontre o registro no nosso banco de dados, atualiza uma senha criptografada e o nome
    - Todos parametros devem ser solicitados, e verificados. Caso a pessoa não passe, retorne uma mensagem clara de qual item não foi passado 

*/

app.put('/bibliotecaria/:registro',(request,response)=>{

})

//--------------- DELETAR PESSOA BIBLIOTECÁRIA ----------------

app.delete('/bibliotecaria/:registro',(request, response)=>{
    const registro = Number(request.params.registro)

    const verificarPorRegistro = pessoasBibliotecarias.findIndex((numeroRegistro)=> numeroRegistro.registro === registro)

    if(verificarPorRegistro === -1){
        response
        .status(400)
        .send(JSON.stringify({ Mensagem: "Número de registro não encontrado" }))
    }

    if(verificarPorRegistro !== -1){
        pessoasBibliotecarias.splice(verificarPorRegistro, 1)

        response.status(200).send(JSON.stringify({ Mensagem: `Pessoa bibliotecária deletada com sucesso!` }))

    }

})

//--------------- VERIFICAR SERVIDOR ----------------


app.listen(PORT,()=> console.log('Servidor rodando na porta 3333'))