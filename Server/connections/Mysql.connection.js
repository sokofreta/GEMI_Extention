import mysql from 'mysql2';

  const MySqlCon = mysql.createConnection({
      user: "root",
      password: "S@sanas00!",
      port:3306
  })

  MySqlCon.connect((err)=> {
      if (err) {throw new Error(err)}
          console.log("Mysql Connected") 
        MySqlCon.query("Use Users")        
  });
export const MysqlConnection = MySqlCon

