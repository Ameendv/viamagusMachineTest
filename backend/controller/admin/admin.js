const express = require('express')
const app = express()
const Tasks = require('../../models/tasks')
const Admin = require('../../models/admin')
const { createError } = require('../../createError/createError')
const Team = require('../../models/team')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    login: async (req, res, next) => {

        await Admin.findOne({ username: req.body.username }).then(async (data) => {
            if (!data) {
                next(createError(404, 'User not found'))
            } else if (await bcrypt.compare(req.body.password, data.password)) {

                const admin = { name: req.body.username }

                const accessToken = generateAccessToken(admin)

                res.status(200).json({ accessToken })
            } else {
                next(createError(401, 'Incorrect password'))
            }
        }).catch((error) => {
            console.log(error)
        })
    },
    createTask: async (req, res, next) => {
        

            req.body.assignee = req.user.name

            await Tasks.create(req.body).then((response) => {

                res.status(200).json({ message: 'Task created successfully' })
            }).catch((error)=>{
                next(createError(401,'All data required'))
            })
        
    },
    addTeam:async(req,res,next)=>{
        
            await Team.create(req.body).then((response)=>{
                res.status(200).json({message:'Team created succesfully'})
            }).catch((error)=>{
                res.status(500)
            })
      
    },
    assignTask:async(req,res,next)=>{
        if(!req.query.userId || !req.query.taskId){
            return next(createError(400,'Users id and task id required to assign a task'))
        }

        await Tasks.updateOne({_id:req.query.taskId},{$set:{assignedTo:req.query.userId}}).then((response)=>{
            res.status(200).json({message:'Task assigned to a team member'})
        }).catch((error)=>{
            res.status(500)
        })
    },
    getTasks:async(req,res)=>{
        await Tasks.find().then((response)=>{
            console.log(response)
        }).catch((error)=>{
            res.status(500)
        })
    },
    editStatus:async(req,res,next)=>{
        if(!req.query.id){
            return next(createError(400,'Task id is required'))
        }
        await Tasks.updateOne({_id:req.query.id},{$set:{status:req.body.status}}).then((response)=>{
            console.log(response)
            res.status(200).json({message:'Status updated succesfully'})
        }).catch((error)=>{
            res.status(500)
        })
    },
    editProperties:async(req,res,next)=>{
        
        if(!req.query.id){
            return next(createError(400,"Task's id needed to edit a task"))
        }


       for(i of Object.values(req.body)){
        if(i===''){
            next(createError(401,'All fields required'))
        }else{
            await Tasks.updateOne({_id:req.query.id},{$set:{...req.body}}).then((response)=>{
                console.log(response)
            }).catch((error)=>{
                console.log(error)
            })
        }
       }
    }
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}
