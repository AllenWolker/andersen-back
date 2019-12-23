export default
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
app.post('/api/new-list', (request, response) => {
    const list = request.body.data;
    const id = request.body.id;
    console.log('list data',request.body);
    pool.connect((err, db, done) => {
        if (err) {
            return response.status(400).send(err);
        } else {

            const sql = 'INSERT INTO todo (id,data) VALUES($1, $2)';
            db.query(sql, [id,list], (err, table) => {
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

