const router = require('express').Router()
const personModel = require('../model/person.model')
const ObjectID = require("mongoose").Types.ObjectId; 


// ----- POST ----- : two options for post Person  by( res.body & Array) -----
router.post('/save', (req, res) => { 
    const { name, age, sex, favoriteFood } = req.body
    const person = new personModel( { name: name, age: age, sex: sex, favoriteFood: favoriteFood })
    person.save(function(err, data){
        if(err){
            return res.status(500).send(err)
        } else {
            res.status(201).send({data})
        }
    })
})
router.post('/create', (req, res) => {
    const arrayOfPeople = [ { name: "Sam", age: 21, sex: "Man", favoriteFood: ["chakchouka", "pizza"] } 
                            // , { name:'Ait', age: 27, sex: "Man", favoriteFood: ['rose'] }  
                        ]  
    personModel.create( arrayOfPeople , (err,data)=>{
        if(!err){
            return res.status(201).send({data : data })
        } else {
            return res.status(500).send(err)}
    } )
})


//  ------ GET ----- := -----
// get All 
router.get('/',  async (req, res) => { 
    const persons = await  personModel.find()
    res.status(200).send( persons )
})

// findOne by favoriteFood 
// using url-api(:params) for searching person by favorite food...
router.get('/favFood/:favFood', async (req, res) => {
    const persons = await  personModel.findOne({ favoriteFood: req.params.favFood })
    if(!persons) return res.status(404).send( {msg: 'any person in db know or like this food'}) 
    res.status(201).send( persons )
})

// search by id 
router.get('/:id', async (req, res) => {
    if(!ObjectID.isValid(req.params.id)) 
        return  res.status(400).send( "ID unknown : " + req.params.id) 

    personModel.findById({ _id: req.params.id } , (err, doc)=> {
        if(!err) return res.status(200).send(doc) 
        else  return res.status(500).send(err) 
    })
})


//Classic Updates by Running: Find, Edit, then Save
router.put('/fes/:id', async (req, res) => {
    if(!ObjectID.isValid(req.params.id)) 
        return  res.status(400).send( "ID unknown : " + req.params.id) 

    personModel.findOne({_id: req.params.id}, (err,doc)=> {
        // console.log(doc);
        if(err) return res.status(400).send(err)
        doc.favoriteFood.push('hamburger') //  || dynamicly :=> push( req.body.newFavFood  & verify if is null return error
        doc.save()
        res.status(200).send(doc)
    } )
})

// Updates :
router.put('/up/:personName', (req, res) =>{ 
    personModel.findOneAndUpdate(
        { name: req.params.personName } , 
        { $set:{age: 25}}, { new: true } , 
        (err,doc)=> { 
            if(!err) {
                return res.status(202).send(doc)
            } else { return res.status(400).send(err) }
        } ) 
})

// delete person by id :
router.delete("/:id" , (req, res) =>{
    if(!ObjectID.isValid(req.params.id)) 
        return  res.status(400).send( "ID unknown : " + req.params.id) 
    personModel.findByIdAndRemove( { _id: req.params.id } , (err, doc) => {
        if(!err) return res.status(200).send( doc? doc : 'this userID does not exist')
        return res.status(500).send(err)
    })
})

// MongoDB and Mongoose - Delete Many Documents with model.remove()
router.delete('/xs/s', async (req, res)=> {
    
    personModel.remove({age: req.params.age },  function (err, result) {
        if (err){
            res.status(500).send(err)
        }else{
            res.status(200).send(result)
        }
    });
    
})


// --- Search Query Helpers to Narrow Search Results --- : 
router.get('/search/:byFood' , async (req, res)=> { 

    personModel.find({ favoriteFood : req.params.byFood })
        .sort({name: 1}) //  sort ascending by firstName
        .limit(3) // limit to 3 
        .select({name: true}) // select only the true key
        .select({favoriteFood: true })  // .select("-age" ) //  or { age: false}  // dans le model on va enlver the key= age 
        .exec((err, data)=>{
            if(err) return res.status(400).send(err)            
            else {
                return data.length ? res.status(200).send(data) :  res.send({msg: "this food is unknown from users"})
            }       
        })
})



module.exports = router 