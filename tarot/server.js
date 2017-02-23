var http = require('http');
var mysql = require('mysql');
var bodyParser = require("body-parser");
var express = require('express');
var app = express();
// CORS support
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var pool = mysql.createPool({
    host: 'localhost',
    user: 'josip34',
    password: '2404983300031',
    database: 'josip',
    port: 3306
});
// definiranje zadane rute 
var apiRoutes = express.Router();
var port = 9000;
// namještanje da zaprima informacije od postmana iako za sad nepotrebno jer koristimo samo GET
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
apiRoutes.get('/', function (req, res) {
    res.json({ message: 'API radi!' });
});
//Dohvaćanje svih karata
apiRoutes.get('/karte', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.error("Dogodila se greška: " + err);
        }
        var query = "SELECT * FROM cards";
        var table = ["cards"];
        query = mysql.format(query, table);
        connection.query(query, function (err, rows) {
            connection.release();
            if (err) {
                return next(err);
            }
            else {
                res.json({
                    success: true,
                    karte: rows
                });
            }
        });
    });
});
// dohvaćanje po id-u
apiRoutes.get('/karte/:id', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.error("Dogodila se greška: " + err);
        }
        var id = req.params.id;
        connection.query("SELECT * FROM cards WHERE id = ?", [id], function (err, rows) {
            if (err) {
                return next(err);
            }
            else {
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                var result = {
                    success: true,
                    detail: rows
                };
                res.write(JSON.stringify(result));
                res.end();
            }
        });
    });
});
// sve rute sadržavati će /api
app.use('/api', apiRoutes);
// pokretanje 
app.listen(port);
console.log('API radi @ port:' + ' ' + port);
//# sourceMappingURL=server.js.map