import mysql from 'mysql2/promise';
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'S3cur3#1',
  database: 'chat_db'
});
export default pool;