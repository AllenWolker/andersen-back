const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {Pool} = require('pg');
const cors = require('cors');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'testdb',
    password: 'admin',
    port: 8000,
    max: 10,
    idleTimeoutMillis: 30000,
});

// Используем фреймворк Express для быстрой разработки на Node.js
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cors());
app.get('/api/list', (request, response) => {
    pool.connect((err, db, done) => {
        if (err) {
            return response.status(400).send(err);
        } else {
            db.query('SELECT * FROM todo', (err, table) => {
                done();
                if (err) {
                    return response.status(400).send(err);
                } else {
                    response.status(201).send(table.rows);
                }
            })
        }
    })
});
app.delete('/api/list/remove/:id', (request, response) => {
    const id = request.params.id;
    console.log(id);
    pool.connect((err, db, done) => {
        if (err) {
            return response.status(400).send(err);
        } else {
            db.query('DELETE FROM todo WHERE id = $1', [id], (err, table) => {
                done();
                if (err) {
                    return response.status(400).send(err);
                } else {
                    response.status(201).send(table.rows);
                }
            })
        }
    })
});
app.post('/api/update-list', (request, response) => {
    const list = request.body.data;
    const id = request.body.id;
    console.log('list data',request.body);
    pool.connect((err, db, done) => {
        if (err) {
            return response.status(400).send(err);
        } else{
            const sql = 'UPDATE todo SET data = $2 WHERE id = $1';
            db.query(sql, [id,list], (err, table) => {
                done();
                if (err) {
                    return response.status(400).send(err);
                } else {
                    console.log("UPDATED DATA SUCCESS");
                    response.status(201).send({message:'данные изменены успешно!'});
                }
            })
        }
    });
});
app.post('/api/new-list', (request, response) => {
    const list = request.body.data;
    const id = request.body.id;
    console.log('list data',request.body);
    pool.connect((err, db, done) => {
        if (err) {
            return response.status(400).send(err);
        } else {

            const sql = 'INSERT INTO todo (data) VALUES($1)';
            db.query(sql, [list], (err, table) => {
                done();
                if (err) {
                    return response.status(400).send(err);
                } else {
                    console.log("INSERTED DATA SUCCESS");
                    response.status(201).send({message:'данные добавлены успешно!'});
                }
            })
        }
    });
});
app.post('/api/login', (request, response) => {
    const login = request.body.login;
    const password = request.body.password;
    console.log(login,password);
    pool.connect((err, db, done) => {
        if (err) {
            return response.status(400).send(err);
        } else {
            db.query('SELECT * FROM users WHERE login=$1 AND password=$2', [login, password], (err, table) => {
                done();
                if (err) {
                    return response.status(400).send(err);
                } else {
                    console.log("SELECTED DATA SUCCESS");
                    response.status(201).send(table.rows);
                    // response.status(201).send(table.rows);
                    //  db.end();
                }
            })
        }
    })
});

app.delete('/api/remove/:id', (request, response) => {
    const id = request.params.id;
    pool.connect((err, db, done) => {
        if (err) {
            return response.status(400).send(err);
        } else {
            db.query('DELETE FROM users WHERE id = $1', [id], (err, table) => {
                done();
                if (err) {
                    return response.status(400).send(err);
                } else {
                    response.status(201).send(table.rows);
                }
            })
        }
    })
});
app.get('/api/users', (request, response) => {
    pool.connect((err, db, done) => {
        if (err) {
            return response.status(400).send(err);
        } else {
            db.query('SELECT * FROM users', (err, table) => {
                done();
                if (err) {
                    return response.status(400).send(err);
                } else {
                    response.status(201).send(table.rows);
                }
            })
        }
    })
});

app.post('/api/new-user', (request, response) => {
    const login = request.body.login;
    const firstName = 'bb';
    const secondName = 'aa';
    const email = request.body.email;
    const password = request.body.password;
    const id = request.body.id;

    pool.connect((err, db, done) => {
        if (err) {
            return response.status(400).send(err);
        } else {
            const field = [login, firstName, secondName, email, password, id];
            const sql = 'INSERT INTO users (login, firstName, secondName, email, password,id) VALUES($1, $2, $3, $4, $5, $6)';
            db.query(sql, field, (err, table) => {
                done();
                if (err) {
                    return response.status(400).send(err);
                } else {
                    console.log("INSERTED DATA SUCCESS");
                    response.status(201).send({message:'Регистрация прошла успешно!'});
                }
            })
        }
    });
});
// Слушаем приложение на 3000 порте, если он не задан процессом
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`The app is running in PORT ${PORT}`)
});


