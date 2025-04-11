import express from 'express'
import checkAuth from '../middleware/auth.js'
import checkRole from '../middleware/role.js'
import Category from '../model/category.js'
import { checkCacheCategories } from '../middleware/category/checkCateCache.js'
import client from '../../config/redis.js'

const categoryRouter = new express.Router()


categoryRouter.post('/categories',checkAuth,checkRole('admin'),async (req,res)=>{
    try {
        const categories = new Category({
            ...req.body
        })

        await categories.save()

        res.status(201).send(categories)
    } catch (error) {
        res.status(400),send(error.message)
    }
})


categoryRouter.get('/categories',checkAuth,checkCacheCategories,async (req,res)=>{
    try {
        const categories = await Category.find({})

        if(!categories){
            return res.status(404).send()
        }

        if(req.categoryKey){
            await client.setEx(req.categoryKey,3600,JSON.stringify(categories))
        }
   
        res.status(201).send(categories)
    } catch (error) {
        res.status(400),send(error.message)
    }
})

categoryRouter.delete(
    "/categories/:id",
    checkAuth,
    checkRole("admin"),
    async (req, res) => {
      try {
        const category = await Category.findById(req.params.id);
  
        if (!category) {
          return res.status(404).send({
            error: "category not found",
          });
        }
  
        await Category.deleteOne({ _id: category._id });
  
        res.status(200).send(category);
      } catch (error) {
          res.status(500).send(error.message)
      }
    }
  );
  
  categoryRouter.patch('/categories/:id',checkAuth,checkRole('admin'),async (req,res)=>{
      try {
          
          const updates = Object.keys(req.body)
          const category = await Category.findById(req.params.id)
  
          if(!category){
              return res.status(404).send('category not found')
          } 
  
          const allowed = ['name','description']
  
          const isAllowed = updates.every((values)=>allowed.includes(values))
  
          if(!isAllowed){
              return res.status(400).send({
                  error : 'field is invalid'
              })
          }
  
          updates.forEach((value)=>category[value] = req.body[value])
  
          await category.save()
  
          res.status(200).send(category)
  
      } catch 
      (error) {
          res.status(500).send(error.message)
      }
  })


export default categoryRouter