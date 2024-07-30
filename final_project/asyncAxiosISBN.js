const axios = require('axios').default;

// Function to connect to a URL and handle the response
/*const connectToURL = (url) => {
    // Sending a GET request to the specified URL using axios
    console.log('URL:'+url);
    const req = axios.get(url);
    console.log(req);
    req.then(resp => {
        console.log("Fulfilled");
        console.log(resp.data);
    })
    .catch(err => {
        console.log("Rejected for url " + url);
        console.log(err.toString());
    });
}*/

const connectToURL = async(url)=>{
    console.log('URL:'+url);
    const outcome = axios.get(url);
    console.log(outcome);
    let listOfWork = (await outcome).data;
    console.log('waiting');
   // Object.values(listOfWork).forEach((book)=>{
      console.log(listOfWork);
   // });
}

// Valid URL
connectToURL('http://localhost:5000/isbn/1');