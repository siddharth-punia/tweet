const { hasSubscribers } = require('diagnostics_channel');
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const PORT = 4445;
const methodOverride = require('method-override');

app.use(methodOverride('_method'));

let num=4;
let tweets =[
    {
        id:1,
        twitter_user: "elon musk",
        tweet_message: "i resign from twitter"
    },
    {
        id:2,
        twitter_user: "bill gates",
        tweet_message: "i am rich"
    },
    {
        id:3,
        twitter_user: "vladimir putin",
        tweet_message: "russia"
    }
    
]

let numc=2;
let comments = [
    {
        idc:1,
        tweetid: 1,
        user_comment: 'bill gates',
        tweet_comment: 'hehe'
    }
]
hbs.registerPartials(__dirname+'/views/partials')
app.use(express.static(path.join(__dirname,'static')));
app.use(express.urlencoded({extended:true}));
app.set('view engine','hbs');

app.get('/',(req,res)=>{
    res.redirect('/blogs');
})

app.get('/blogs',(req,res)=>{
    res.render('twitterHomepage',
    {
        tweets : tweets
    });
})

app.get('/blogs/new',(req,res)=>{
    res.render('newTweet');
})


///////comment////////////
app.get('/comment/:tweetid',(req,res)=>{
    const {tweetid} = req.params;
    res.render('newComment',
    {
        tweetid
    });
})

app.post('/blogs/:tweetid',(req,res)=>{
    const {tweetid} = req.params;
    const {user_comment, tweet_comment} = req.body;
    
    comments.push({
        idc: numc,
        tweetid: tweetid,
        user_comment,
        tweet_comment
    })
    console.log("Comments: ",comments);
    numc++;
    res.redirect(`/blogs/${tweetid}`);
})

app.post('/blogs',(req,res)=>{
    const {twitter_user, tweet_message} = req.body;
    tweets.push({
        id:num,
        twitter_user,
        tweet_message
    })
    num++;
    res.redirect('/blogs');
})


app.get('/blogs/:id',(req,res)=>{
    const {id} = req.params;
    const single_tweet = tweets.filter((tweets)=> tweets.id === parseInt(id));
    const tweetComments = comments.filter((comment)=>comment.tweetid == id);
    console.log(single_tweet);
    console.log(tweetComments);
    res.render('showTweet',{
        tweet: single_tweet[0],
        comments: tweetComments
    });
})


app.get('/blogs/:id/edit',(req,res)=>{
    const {id} = req.params;
    const editTweet = tweets.filter((tweet)=>parseInt(id) === tweet.id);
    res.render('editTweet',editTweet[0]);
})

app.put('/blogs/:id',(req,res)=>{
    const {id} = req.params;
    let tweetIndex;
    tweets.map((tweet,indx)=>{
        if(tweet.id === parseInt(id)){
            tweetIndex = indx
        }
    })

    const {twitter_user,tweet_message } = req.body;

    tweets[tweetIndex].twitter_user = twitter_user;
    tweets[tweetIndex].tweet_message = tweet_message;

    res.redirect('/blogs');
})

app.delete('/blogs/:id',(req,res)=>{
    const {id} = req.params;
    const deleteTweet  = tweets.filter((tweet)=>tweet.id!== parseInt(id));
    tweets = deleteTweet;
    res.redirect('/blogs');
})

app.listen(PORT,()=>{
    console.log('http://localhost:'+PORT);
})
