const{sign,verify}=require('jsonwebtoken')
const createTokens=(user)=>{
   const acc=sign({username:login.find({username:username})},"jwtsec")
   return acc
}
// exporting token
module.exports={createTokens}