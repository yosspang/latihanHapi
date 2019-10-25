const Models = require('../models/index')
const Joi = require('@hapi/joi')
let ok= 200
let notFound= 404

const userHandler = async (request,h)=> {
    try {
        const user = await Models.User.findAll({})
        console.log(user.length)
        if(user.length==0){
            return h.response({  
                statusCode: notFound,
                error: 'Not Found',
                message: 'Not Found'
            }).code(notFound)
        }else{
            return { 
                statusCode: ok,
                error: '',
                message: 'Success',
                content: user
            }
        }
    }catch (error) {
        return h.response({ error: error.message }).code(400)
    }
}

const createUserHandler = async (request,h) => {
    try {
        const {firstNameReq, lastNameReq, emailReq, genderReq, registerDateReq} = request.payload;
        if((await Models.User.findAll({where:{email:emailReq}})).length != 0){
            return h.response({  
                statusCode: notFound,
                error: 'Not Found',
                message: 'Mail must be unique'
            }).code(notFound)
        }else{
            console.log(request.payload);
            const user = await Models.User.create({
                firstName: firstNameReq,
                lastName: lastNameReq,
                email: emailReq,
                gender: genderReq,
                registerDate: registerDateReq
            })
            return{
                data: user,
                statusCode: ok,
                error: '',
                message: 'New user has been created.'
            }
        }
    }catch (error){
        return h.response({
            error: error.message
        }).code(400)
    }
}

const updateUserHandler = async (request, h) => {
    try{
        const user_id = request.params.id;
        const {firstNameReq, lastNameReq, emailReq, genderReq, registerDateReq} = request.payload;
        if((await Models.User.findAll({where:{id:user_id}})).length == 0){
            return h.response({  
                statusCode: notFound,
                error: 'Not Found',
                message: 'Not Found'
            }).code(notFound)
        }
        const user = await Models.User.update({
            firstName: firstNameReq,
            lastName: lastNameReq,
            email: emailReq,
            gender: genderReq,
            registerDate: registerDateReq
        },{
            where:{
                id: user_id
            }
        })
        const dataRequest = request.payload
        console.log('dataRequest');
        console.log(user);
        return{
            data: dataRequest,
            statusCode: ok,
            error: '',
            message: 'User has been updated'
        }
    } catch (error){
        return h.response({
            error: error.message
        }).code(400)
    }
}

const deleteUserHandler = async (request,h) => {
    try{
        const user_id = request.params.id;
        if((await Models.User.findAll({where:{id:user_id}})).length == 0){
            return {  
                statusCode: notFound,
                error: 'Not Found',
                message: 'Not Found'
            }
        }else{
            await Models.User.destroy({
                where:{
                    id: user_id
                }
            })
            return { 
                statusCode: ok,
                error: '',
                message: 'User has been deleted.' 
            }
        }
    } catch (error){
        return h.response({
            error: error.message
        }).code(400)
    }
}

module.exports = [
    { 
        method: 'GET', 
        path: '/user/list', 
        handler: userHandler
    },
    { 
        method: 'POST', 
        path: '/user/postData', 
        options:{
            validate:{
                payload:{
                    firstNameReq: Joi.required(), 
                    lastNameReq: Joi.required(), 
                    emailReq: Joi.string().email().required(),
                    genderReq: Joi.required(), 
                    registerDateReq: Joi.date().required()
                    
                }
            }
        },
        handler: createUserHandler
    },
    { 
        method: 'PATCH', 
        path: '/user/postUpdate/{id}', 
        handler: updateUserHandler
    },
    { 
        method: 'DELETE', 
        path: '/user/deleteUser/{id}', 
        handler: deleteUserHandler
    }
]