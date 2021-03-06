var path = require('path');
var url = require('url');
var express = require('express');
var fs    = require('fs');
var https = require('https');
var http = require('http');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');


var CONFIG = require('./config.js')


var favicon = require('serve-favicon');

var db = require('./db/config');
var Users = require('./db/collections/users');
var User = require('./db/models/user');
var Artists = require('./db/collections/artists');
var Artist = require('./db/models/artist');
var Tags = require('./db/collections/tags');
var Tag = require('./db/models/tag');
var Performances = require('./db/collections/performances');
var Performance = require('./db/models/performance');

var Artist_User = require('./db/models/artist_user')


var options = {
  key:  fs.readFileSync('keys/server.key'),
  cert: fs.readFileSync('keys/server.crt')
};

var app = express();

var port = 1338;

var server = https.createServer(options, app)

var io= require('socket.io').listen(server);

server.listen(port, function() {
  console.log(`Running on port: ${port}`);
});



app.get('/populateDatabase',
  function(req, res) {

    var testUser = new User({
      username: 'Jane Bond',
      admin: true
    });

    var testPerf = new Performance({
      room: 'Jim Bob Burshea',
      title: 'Jimbo sings the blues',
      short_description: 'My blues are outta control'
    });

    var testTag = new Tag({
      tagname: 'doo wop'
    });

    // change testPerf to whatever database table you want to add a row to each time you go to /populateDatabase
    testPerf.save()
    .then(function(newEntry) {
      // change Performances to the table you want to populate
      Performances.add(newEntry);
      res.status(200).send(newEntry);
    })
    .catch(function(err) {
      console.error(err);
    });
  }
);


///////////////////////////////////////////////\


var jwt = require('jsonwebtoken');
var expressJWT = require('express-jwt')
var bodyParser = require('body-parser');
var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy
    ,   GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

app.use(favicon(__dirname + '/client/public/img/favicon.png'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use('/',express.static(path.join(__dirname, 'client')));



app.use(expressJWT({secret : CONFIG.JWT_SECRET}).unless({path : ['/',/^\/auth\/.*/,'/authenticateFacebook','/about', /^\/api\/.*/, /^\/api\/messages\/.*/,/^\/activeStream\/.*/, /^\/public\/.*/, /^\/router\/.*/]}));



app.post('/auth/signIn/', (req, res) => {
    new Artist({user_name: req.body.user_name}).fetch().then(function(found){
        if(found){

            var check = bcrypt.compareSync(req.body.password, found.get('password'))
            if (check){

                var myToken = jwt.sign({user_name:found.get('email_id')},CONFIG.JWT_SECRET)
                res.status(200).json({token: myToken, artist_details : found});
            }
            else {
                res.sendStatus(403).json({status : 'Incorrect password'});
            }
        }
        else {
            res.sendStatus(403).json({status : 'User does not exist, please sign up'});
        }
    });

});

app.post('/auth/signUp/', (req, res) => {

    new Artist({user_name: req.body.user_name, password: req.body.password}).fetch().then(function (found) {
        if (found) {
            res.status(403);

        }
        else {

            var newArtist = new Artist({
                user_name: req.body.user_name,
                password: req.body.password,
                email_id: req.body.email_id,
                brief_description: req.body.brief_description,
                user_image: req.body.user_image,
                display_name: req.body.display_name,
                genre: req.body.genre
            });
            newArtist.save().then(function (artist) {
                Artists.add(artist);
                var myToken = jwt.sign({user_name: req.body.email_id}, CONFIG.JWT_SECRET)

                res.status(200).json({token: myToken, artist_details: artist});
            })
        }
    });

       new Performance({active: false, room: req.body.user_name})
        .save()

});

app.get('/getData/', (req, res) => {
    res.status(200)
        .json({data: 'Valid JWT found! This protected data was fetched from the server.'});

})

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new FacebookStrategy({
        clientID: CONFIG.FB_CLIENT_ID,
        clientSecret: CONFIG.FB_APP_SECRET,
        callbackURL: CONFIG.FB_CALL_BACK,
        profileFields: ['id','email', 'displayName', 'photos']
    },
    function(accessToken, refreshToken, profile, done) {

        new User({facebook_id : profile.id}).fetch().then(function(response){

            if(response){
                return done(null,response.attributes)
            }
            else{

                var facebookUser = new User({
                    facebook_id : profile.id,
                    email_id : profile.emails[0].value ? profile.emails[0].value : profile.displayName,
                    display_name : profile.displayName,
                    user_image : profile.photos[0].value
                })

                facebookUser.save().then(function(newFacebookUser) {
                    Users.add(newFacebookUser);
                    return done(null,newFacebookUser)
                });
            }
        });
    }
));

passport.use(new GoogleStrategy({
        clientID: CONFIG.G_CLIENT_ID,
        clientSecret: CONFIG.G_APP_SECRET,
        callbackURL: CONFIG.G_CALL_BACK
    },
    function(accessToken, refreshToken, profile, done) {
        new User({google_id : profile.id}).fetch().then(function(response){
            if(response){
                
                return done(null,response.attributes)
            }
            else{

                var googleUser = new User({
                    google_id : profile.id,
                    email_id : profile.emails[0].value ? profile.emails[0].value : profile.displayName ,
                    display_name : profile.displayName,
                    user_image : profile.photos[0].value
                })

                googleUser.save().then(function(newGoogleUser) {
                    Users.add(newGoogleUser);
                    return done(null,newGoogleUser)
                });
            }
        });
    }
));



app.use(passport.initialize());


app.get('/auth/facebook/',
    passport.authenticate('facebook',{scope : 'email'}));

var current_token;
var current_user;

app.get('/auth/facebook/callback/',

    passport.authenticate('facebook', { failureRedirect: '/' }),

    function(req, res) {
        current_user = req.user;
        current_token = jwt.sign({user_name: (req.user.email_id ) },CONFIG.JWT_SECRET);
        res.redirect('/router/socialLogin')
    }

);

app.get('/auth/google/',
    passport.authenticate('google',{scope : 'email'}));

app.get('/auth/google/callback/',

    passport.authenticate('google', { failureRedirect: '/login' }),

    function(req, res) {
        current_user = req.user;
        current_token = jwt.sign({user_name: (req.user.email_id ) },CONFIG.JWT_SECRET);
        res.redirect('/router/socialLogin')
    }

);


app.get('/auth/validateSocialToken',(req, res) => {

    res.json({token: current_token, user_details : current_user});
});

/////////////////ACTIVE STREAM//////////

app.put('/api/describe/', (req, res) => {

  Performance.where({ room: req.body.room }).fetch().then(function(updatedPerf){
    updatedPerf.save({
      long_description: req.body.long_description,
      performance_image: req.body.performance_image,
      rated_r: JSON.parse(req.body.rated_r),
      short_description: req.body.short_description,
      title: req.body.title
    }, {patch: true})
    .then(function(perf) {
      Performances.add(perf);
      var responseObject = {
        title: perf.get('title'),
        short_description: perf.get('short_description'),
        long_description: perf.get('long_description'),
        performance_image: perf.get('performance_image')
      };
      res.status(200).json(responseObject); // this object is returned to the client
    });
  });

});

app.put('/api/activeStreams', function(req, res){

    Performance.where({ room: req.body.room }).fetch()
    .then(performance => {
        performance.save({active: req.body.active}, {patch: true});
        res.json({active : req.body.active})
    })
});

app.get('/api/activeStreams', function(req, res) {
    Performances
    // .query({where: {active: true}})
    .fetch({withRelated:['tags']}).then(function (performances) {
        res.status(200).send(performances.models);
    });

});

app.get('/api/allStreams', function(req, res) {
    Performances
        .fetch().then(function (performances) {
        res.status(200).send(performances.models);
    });

});

app.put('/api/updatePerformanceViewCount', function(req, res) {
    Performance.forge({room: req.body.room})
        .fetch({require: true})
        .then((performance)=>{
            performance.save({
                number_of_viewers : performance.get('number_of_viewers') + 1
            })
            res.json({views : (performance.get('number_of_viewers') + 1)})
        })

});

app.get('/api/currentViewers', function(req, res) {

    Performances.query({where: {room: req.body.room}}).fetch().then(function (performance) {

        res.status(200).json({views : performance.get('number_of_viewers')});
    });

});

//*********Tags
app.post('/api/addTag', function (req,res){
    var tagName= req.body.tagname;
    var userId= req.body.user_Id;
    var performanceId= req.body.performanceId;

    Tag.where({ tagname: tagName }).fetch()
    .then(tag => {
        if(tag) {
            Performance.where({id: performanceId}).fetch()
            .then(performance => {
               performance.tags().attach(tag.id);
               res.status(200).send({tagname: null, performanceId: performanceId}); //return nothing if tag is already in db

            })
        } else {
            var newTag= new Tag({
                tagname: tagName,
                user_id: userId
            })
            newTag.save().then (function (tag){
            
                Tags.add(tag);

                Performance.where({id: performanceId}).fetch()
                .then(performance => {
                    performance.tags().attach(tag.id);
                    res.status(200).send({tagId: tag.id, tagname: tag.attributes.tagname, performanceId: performanceId}); //return the performance with updated tags

                })
            })
        }
    })

});



//**********RETOKENIZE LOGIN
app.get('/auth/getTokenizedUserDetails',(req,res)=>{
    Artist.query({where: {email_id: req.query.email}}).fetch().then(function(found){
        if(found){
            var myToken = jwt.sign({user_name:found.get('email_id')},CONFIG.JWT_SECRET)
            res.status(200).json({token: myToken, artist_details : found});
        }
        else {
            User.query({where: {email_id: req.query.email}}).fetch().then(function(response){
                if(response){
                    res.status(200).json({token: myToken, artist_details : response});

                }
                else{
                    res.status(404).json({status : 'User does not exist, please sign up'});
                }
            });
        }
    });

})


//********* Fetch all registered users

app.get('/api/allRegisteredArtists',function(req,res){

   new Artist().fetchAll().then((allArtists)=>{

       res.status(302).json({registeredArtists : allArtists.models})

    })

})

//***************** Create Artist User Relation

app.post('/api/subscribeToArtist',function(req,res){
    var data = req.body;
    new Artist_User({
        artist_id: data.artist_id,
        user_id: data.user_id
    }).fetch().then(function(found){
        if(found){
            res.json({error : 'already subscribed'})
        }
        else{
           new Artist_User({
                artist_id: data.artist_id,
                user_id: data.user_id
            }).save()
               .then(function(data){
                   res.json({data : 'Subscribed successfully'});
               })
        }
    })

})

//************** Get all artist subscribers

app.get('/api/emailAllSubscribers',function(req,res){
    var data = []

    Artist_User.query({where: {artist_id :req.query.artist_id }}).fetchAll().then(function(emails){
        emails.models.map(function(user_id){
           User.query({where : {id : user_id.attributes.user_id}}).fetch().then(function(model){
              sendEmailTo(model.get('email_id'),req.query.artist_name,req,res)

          })
        })
    });
    res.json("EMAIL SENDING")
});

//************NODE EMAIL
var emailJS = require('emailjs/email')

var sendmail = emailJS.server.connect({
    user: CONFIG.G_MAIL_ADDRESS,
    password: CONFIG.G_PASSWORD,
    host: "smtp.gmail.com",
    ssl: true
});

function sendEmailTo (email_id,artist_name,req,res){
    var message = {

        from: "GIGG.TV <teamdreamstream4@gmail.com>",
        to: "User <" + email_id + ">",
        subject: artist_name + " IS LIVE NOW!",
        text: "Click on gigg.tv/router/activeStream/" + artist_name + " . Join in for a good time"
    };

    sendmail.send(message, function (err, message) {
        var body = null;
        if (err) {
            body = err.toString();
        } else {
            console.log("EMAIL SENT IN SERVER")
        }
    });
}

//******* Test  Chat **************
//set env vars
// var mongoose= require('mongoose');
// process.env.MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/chat_dev';
// process.env.PORT = process.env.PORT || 3000;

// connect our DB
// mongoose.connect(process.env.MONGOLAB_URI);



//load routers
var messageRouter = express.Router();
require('./server/routes/message_routes.js')(messageRouter);

app.use('/api', messageRouter);


var socketioJwt= require('socketio-jwt');


io.set('transports', ["websocket", "polling"]);


io.on('connection', function (socket){
    socket.join('Lobby');
    socket.on('chat mounted', function(user) {
      // TODO: Does the server need to know the user?
      socket.emit('receive socket', socket.id)
    })
    socket.on('leave channel', function(channel) {
      socket.leave(channel)
    })
    socket.on('join channel', function(channel) {
      socket.join(channel.name)
    })
    socket.on('new message', function(msg) {
      socket.broadcast.to(msg.channelID).emit('new bc message', msg);
    });
    socket.on('new channel', function(channel) {
      socket.broadcast.emit('new channel', channel)
    });
    socket.on('typing', function (data) {
      socket.broadcast.to(data.channel).emit('typing bc', data.user);
    });
    socket.on('stop typing', function (data) {
      socket.broadcast.to(data.channel).emit('stop typing bc', data.user);
    });

  });

//********* End Test Chat **********


app.get('*', function (request, response){
    response.sendFile(path.resolve(__dirname, 'client', 'index.html'))

})

module.exports.server = server;


