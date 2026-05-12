export const response = (statusCode, message, datas, res) => {
    res.status(statusCode).json({ 
        payload : {
            "status_code": statusCode,
            "datas": datas,
            "message": message
        },
        pagination: {
            "prev": "",
            "next": "",
            "max": 0
        }

    });

    return res;
}