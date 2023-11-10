const joi = require('joi')
const Validator = require('validatorjs')

const ValidateUserCreationWithJoi = async (req, res, next) => {
    try {
        const schema = joi.object({
            username: joi.string().min(5).max(20).required(),
            first_name: joi.string().min(5).max(255).required(),
            last_name: joi.string().min(5).max(255).required(),
            password: joi.string().pattern(new RegExp('^[a-zA-Z0-9@#$]{3,30}$')).required(),
            email: joi.string().email().required()
        })

        await schema.validateAsync(req.body, { abortEarly: true })
    
        next()
    } catch (error) {
        return res.status(422).json({
            message: error.message,
            success: false
        })
    }
}


const ValidateUserCreationWithValidatorJs = async (req, res, next) => {
    let data = req.body;
      
      let rules = {
        username: 'required|string',
        first_name:'required|string',
        last_name:'required|string',
        password: 'required|min:6|max:30',
        email: 'required|email'
      };
      
      let validation = new Validator(data, rules);

      if (!validation.passes()) {
        return res.status(422).json({
            message: validation.errors.errors,
            success: false
        })
      }

      next()
      
}

module.exports ={
    ValidateUserCreationWithJoi,
    ValidateUserCreationWithValidatorJs
}