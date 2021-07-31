const express = require('express');
const app = express();
const Joi = require('joi');

app.use(express.json());

app.get('/', (req, res) =>{
    res.send('hola mundo desde express');
});
//usuarios
const usuarios = [
    {id:1, nombre: 'elena'},
    {id:2, nombre:'juan'},
    {id:3, nombre: 'pedro'}
];

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});
//seleccion de usuarios y buscar en arreglos.
app.get('/api/usuarios/:id', (req, res) =>{
    let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if(!usuario) {
        res.status(404).send('usuario no encontrado');
    }
    res.send(usuario);
})


app.get('/api/usuarios/:year/:mes', (req, res)=> {
    res.send(req.params);
});

//capturando query
//app.get('/api/usuarios/:sexo', (req, res)=> {
//    res.send(req.query);
//});

app.post('/api/usuarios', (req, res) =>{
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });

    const {error, value} = schema.validate({ nombre: req.body.nombre });
    if(!error){
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre            //VALIDACION CON MODULO JOI 
        };
        usuarios.push(usuario);
        res.send(usuario);
    }
    else{
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);

    }
    

/*   
    VALIDACION SIMPPLE

    if(!req.body.nombre || req.body.nombre.length <= 2){ 
        res.status(400).send('debe ingresar un nombre, con mas de 3 caraceres ');
         return;
}
    const usuario = {
        id: usuarios.length + 1,
        nombre: req.body.nombre
    };
    usuarios.push(usuario);
    res.send(usuario);
*/
});

app.put('/api/usuarios/:id', (req, res) =>{
    let usuario = encontrarUsuario(req.params.id);
    if(!usuario) {
        res.status(404).send('usuario no encontrado');
        return;
    };
    
    const {error, value} = validarUsuario(req.body.nombre);
    if(error){
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }
    usuario.nombre = value.nombre;
    res.send(usuario);
})

app.delete('/api/usuarios/:id', (req, res) =>{
    let usuario = encontrarUsuario(req.params.id);
    if(!usuario) {
        res.status(404).send('usuario no encontrado');
        return;
    };
    const index = usuarios.indexOf(usuario);
    res.send(usuarios.splice(index,1));
})

const port = process.env.PORT || 3000;

app.listen(port, () => {  
    console.log(validarUsuario("rh").error);  
    console.log(`escuchando desde el puerto ${port}`);
});

const encontrarUsuario = (id) => {
    return (usuarios.find(u => u.id === parseInt(id)));
    
}

const validarUsuario = (nom) =>{
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return(schema.validate({ nombre: nom }));

}