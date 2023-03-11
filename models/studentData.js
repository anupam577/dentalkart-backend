const db = require('../config');


const studentData = function (student) {
    this.Name = student.Name;
    this.Roll_No = student.Roll_No;
    this.Address = student.Address;
    this.Institute = student.Institute;
    this.Course = student.Course;
    this.Email = student.Email;
}
studentData.fetchAll = (callback)=> {
    var sqlquery = "SELECT * FROM user";
    db.query(sqlquery, (error, result,field) => {
        if (error) {
            callback(null,error);
        }
        callback(null,result);
    })
}

studentData.postAllData = (callback)=>{
    
}


module.exports = studentData;

