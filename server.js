const express=require('express');
const axios=require("axios");
const app=express();
const port = process.env.PORT || 3000;
const baseUrl="https://www.googleapis.com/youtube/v3/";
const api_key="AIzaSyDSlSpaOoZtLYPtTJ6TcxdJ2AZXAoFdTxU";
app.get('/',(req,res)=>{
    res.send("Home to Express");
});

const getChnanelID=async (videolink)=>{
   
    let vurl=videolink;
    const videoId=vurl.split('?')[1].split('=')[1];
    let url= `${baseUrl}videos?key=${api_key}&part=snippet&id=${videoId}`;
    let response=await axios.get(url);
    
    let channelID=response.data.items[0].snippet.channelId;
    console.log(channelID);
    return channelID;

}
app.get('/loadmore',async(req,res,next)=>{
    let token=req.query.pageToken;
    let channel_id=await getChnanelID(req.query.vrl);
    let fromdate=new Date(req.query.fromdate).toISOString();
    let todate=new Date(req.query.todate).toISOString();
    let url=`${baseUrl}search?key=${api_key}&part=snippet&type=video&channelId=${channel_id}&publishedAfter=${fromdate}&publishedBefore=${todate}&pageToken=${token}`;
    try{
        let response=await axios.get(url);
        console.log(response.data);
       res.send({videos:response.data.items,pageToken:response.data.nextPageToken});

    }
    catch(err){
        next(err);
    }

});
app.get('/search',async (req,res,next)=>{

    console.log(req.query);
    let year=req.query.year;
    let fromdate=new Date(req.query.fromdate).toISOString();
    let todate=new Date(req.query.todate).toISOString();
    let datestart=`${year}-01-01T05:00:00.000Z`;
    let dateend=`${year}-12-31T05:00:00.000Z`;
    let channel_id=await getChnanelID(req.query.vrl);
    let url=`${baseUrl}search?key=${api_key}&part=snippet&type=video&channelId=${channel_id}&publishedAfter=${fromdate}&publishedBefore=${todate}`;
    try{
        let response=await axios.get(url);
        console.log(response.data);
       res.send({videos:response.data.items,pageToken:response.data.nextPageToken});

    }
    catch(err){
        next(err);
    }
    

});

app.listen(port,()=>{
    console.log(`server start ${port}`);
});