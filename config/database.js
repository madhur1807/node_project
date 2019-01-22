if (process.env.NODE_ENV == 'production') {
    module.exports = {
        mongoURI : 'mongodb://madhur:madhur12345@ds027348.mlab.com:27348/vidjot-prod'
    }
} else{
     module.exports = {
        mongoURI : 'mongodb://localhost/data-share'
    }
}