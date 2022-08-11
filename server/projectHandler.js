
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./.env" });
const { MONGO_URI } = process.env;
// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");
const url = require("url");

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

//returns list of all projects which the user is part of

const getAllProjects = async (req,res) =>{
    const client = new MongoClient(MONGO_URI,options);
    try{
        await client.connect();
        const db = client.db("FinalProject");
        const user = req.params.user;
        const result = await db.collection("projects").find({userId:
            user}).toArray();
        if(result){
            res.status(200).json({status:200,data:result});
        }
        else{
            res.status(404).json({status:404,message:"Projects not found"});
        }
    }catch(err){
        res.status(500).json({status:500,message:err.message});
    }
    finally{
        client.close();
        }

}

//returns list of all tasks with status todo of the specific project

const getAllTodoTasks = async (req,res) =>{
    const client = new MongoClient(MONGO_URI,options);
    try{
        await client.connect();
        const db = client.db("FinalProject");
        const projectId = req.params.projectId;
        const result = await db.collection("tasks").find({projectId:projectId,status:"todo"}).toArray();
        if(result){
            res.status(200).json({status:200,data:result});
        }
        else{
            res.status(404).json({status:404,message:"Projects not found"});
        }
    }catch(err){
        res.status(500).json({status:500,message:err.message});
    }
    finally{
        client.close();
        }

}

//returns list of all tasks with status in progress of the specific project

const getAllInProgressTasks = async (req,res) =>{
    const client = new MongoClient(MONGO_URI,options);
    try{
        await client.connect();
        const db = client.db("FinalProject");
        const projectId = req.params.projectId;
        const result = await db.collection("tasks").find({projectId:projectId,status:"inProgress"}).toArray();
        if(result){
            res.status(200).json({status:200,data:result});
        }
        else{
            res.status(404).json({status:404,message:"Projects not found"});
        }
    }catch(err){
        res.status(500).json({status:500,message:err.message});
    }
    finally{
        client.close();
        }

}

//returns list of all tasks with status done of the specific project

const getAllDoneTasks = async (req,res) =>{
    const client = new MongoClient(MONGO_URI,options);
    try{
        await client.connect();
        const db = client.db("FinalProject");
        const projectId = req.params.projectId;
        const result = await db.collection("tasks").find({projectId:projectId,status:"done"}).toArray();
        if(result){
            res.status(200).json({status:200,data:result});
        }
        else{
            res.status(404).json({status:404,message:"Projects not found"});
        }
    }catch(err){
        res.status(500).json({status:500,message:err.message});
    }
    finally{
        client.close();
        }

}

//add task to todo

const addTask = async (req,res) =>{
    //creates a new client
    const client = new MongoClient(MONGO_URI,options);
    try{
        await client.connect();
        //connect to the database
        const db = client.db("FinalProject");
        const {name} = req.body;
        console.log(req.body);
        const projectId = req.params.projectId;
        const result = await db.collection("tasks").insertOne({taskId:uuidv4(),projectId:projectId,status:"todo",description:"",name:name,assignedTo:[]});
        if(result.acknowledged){
            res.status(201).json({status:201,message:"Task added",data:req.body})
        }
    }catch(err){
        res.status(500).json({status:500,message:err.message});
    }
    finally{
        client.close();
        }
}

//add task to todo

const addProject = async (req,res) =>{
    //creates a new client
    const client = new MongoClient(MONGO_URI,options);
    try{
        await client.connect();
        //connect to the database
        const db = client.db("FinalProject");
        const {projectName,projectDescription,createdBy} = req.body;
        const result = await db.collection("projects").insertOne({projectId:uuidv4(),projectName:projectName,projectDescription:projectDescription,createdBy:createdBy,userId:["test.user3@gmail.com","test.user4@gmail.com",createdBy]});
        if(result.acknowledged){
            res.status(201).json({status:201,message:"project added",data:req.body})
        }
    }catch(err){
        res.status(500).json({status:500,message:err.message});
    }
    finally{
        client.close();
        }
}

// const get admin users

const getUserRole = async(req,res) =>{
    const client = new MongoClient(MONGO_URI,options);
    try{
        await client.connect();
        const db = client.db("FinalProject");
        const result = await db.collection("users").find({role:"admin"}).toArray();
        if(result){
            res.status(200).json({status:200,data:result});
        }
        else{
            res.status(404).json({status:404,message:"admin users not found"});
        }
    }catch(err){
        res.status(500).json({status:500,message:err.message});
    }
    finally{
        client.close();
        }

}

// get user for sign in

const getUser = async(req,res) =>{
    const user = url.parse(req.url,true).query;

    const client = new MongoClient(MONGO_URI,options);
    try{
        await client.connect();
        const db = client.db("FinalProject");
        const result = await db.collection("users").findOne({userId:user.email})
        if(result){
            if(user.password === result.password){
            res.status(200).json({status:200,data:result});
            }
            else{
                res.status(400).json({status:400,message:"Password does not match"})
            }
        }
        else{
            res.status(404).json({status:404,message:"User not found"});
        }
    }catch(err){
        res.status(500).json({status:500,message:err.message});
    }
    finally{
    client.close();
    }
}

module.exports = {
    getAllProjects,
    getAllTodoTasks,
    getAllInProgressTasks,
    getAllDoneTasks,
    addTask,
    addProject,
    getUserRole,
    getUser
}