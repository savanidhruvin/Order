exports.getErrorResponse = async (res,status,error)=>{
       return res.status(status).json({
        success: false,
        error
    });
}