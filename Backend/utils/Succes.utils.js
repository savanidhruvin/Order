
exports.getSuccessResponse = async (res,data,massage)=>{
    return res.status(200).json({
        success:'true',
        data,
        massage
    })
}