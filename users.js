


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
    const firstName = request.body.firstName;
    const secondName = request.body.secondName;
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
