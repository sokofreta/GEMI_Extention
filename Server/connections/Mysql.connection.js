import mysql from 'mysql2';

  const MySqlCon = mysql.createConnection({
      user: "root",
      password: "root",
      port:3306
  })

  MySqlCon.connect((err)=> {
      if (err) {console.log(err)}
          console.log("Mysql Connected") 
        //MySqlCon.query("Use Users")        
  });
export const MysqlConnection = MySqlCon

