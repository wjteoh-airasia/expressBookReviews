const axios = require('axios').default;

// Function to connect to a URL and handle the response
const connectToURL = async(url)=>{
    const outcome = axios.get(url);
    console.log(outcome);
    let listOfWork = (await outcome).data;
    console.log('waiting');
    Object.values(listOfWork).forEach((book)=>{
      console.log(book);
    });
}

// Valid URL
connectToURL('http://localhost:5000/');
