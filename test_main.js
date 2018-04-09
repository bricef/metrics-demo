var assert = require('assert');
var request = require('supertest');

var app = require("./main.js");


describe('App', () => {

    before(function(done) {
        app.listen(function(err) {
            if (err) { return done(err); }
            done();
        });
    });

    describe("Catalogue", ()=>{
        it("is JSON", (done) =>{
            request(app)
                .get("/mighty-fine/api/catalogue")
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, (err, res) => {
                    if(err) { return done(err) }
                    var catalogue = JSON.parse(res.text);
                    done();
                })
        })
    })
})