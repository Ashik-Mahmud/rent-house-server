

/* Create Payment Instance for stripe */
const createPaymentInstance = async(req, res) =>{
    try{
        res.status(201).send({
            success: true,
            message: "Welcome to payment instance route"
        })
    }catch(err){
        res.status(404).send({
            success: false,
            message: 'Server Error'+ err
        })
    }
}



//exports
module.exports = {createPaymentInstance}