
import {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './css/WordSearch.css';
import axios from 'axios';
function WordSearch() {
    const [searchValue, setSearchValue] = useState("Fun") ;
    const [postData, setPostData] = useState([]); // postData is now an array

    const [dataInsights, setDataInsights] = useState([]); //insights stuff

    const searchBarHandler = (e) => {
        setSearchValue(e.target.value);
    };
    const formSubmissionHandler = (e) => {
        e.preventDefault();
    
        const data = { searchValue: searchValue };
    
        // Replace the URL with the endpoint of your Django server
        //This api is to get posts data
        axios.post('http://localhost:8080/polls/', data)
            .then(response => {
                console.log("Response from server: ", response.data);
                // Handle the response data as needed
                setPostData(response.data.result);
                console.log(postData);
            })
            .catch(error => {
                console.error("Error making the post request:", error);
                // Handle the error case as needed
            });
    
        //console.log(data);

        axios.post('http://localhost:8080/polls/insights/', data)
            .then(response => {
                //console.log("Response from server: ", response.data);
                // Handle the response data as needed
                setDataInsights(response.data.result);
                console.log(dataInsights);
            })
            .catch(error => {
                console.error("Error making the post request:", error);
                // Handle the error case as needed
            });
            console.log(dataInsights);
    }
    
  return (
    <div className="searchContainer">
        <div className="left">
            <form onSubmit={formSubmissionHandler} className='form'>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={searchBarHandler}
                />
                <button type="submit">
                    <FontAwesomeIcon icon={faMagnifyingGlass} size= "2x"  />
                </button>  
            </form>
    
      
        </div>
        <div className='right'>
            <div className="result">
                <h2>Search Result for "{searchValue}"</h2>
                { dataInsights.length !== 0 && dataInsights.map((insight, index) => 
                <div className="insights">
                    <div key={index} className="insight">
                        <p style={{color: "#73c3d0", fontWeight: "bold"}} >Average Polarity: {parseFloat(insight.Polarity).toFixed(3)}</p>
                        <p style={{color: "#1975B5", fontWeight: "bold"}}>Average Score: {parseFloat(insight.score).toFixed(3)}</p>
                        <p style={{color: "#1E80C1", fontWeight: "bold"}}>Average # of Comments: {parseFloat(insight.num_comments).toFixed(0)}</p>
                        <p style={{color: "#3725A4", fontWeight: "bold"}}>Average Interactiveness Score: {parseFloat(insight.interactiveness_score).toFixed(3)}</p>
                    </div>
                </div>
                )}
            </div>
            
            <div className="posts">
                <h4></h4>
                <ol>
                    {postData.map((post, index) => (
                        <li key={index}>
                            <h2>{post.title}</h2>
                            <p>{post.text_body}</p>
                            <p style={{ fontWeight: "bold"}}>Author: {post.author}</p>
                            <p className="polarity">Polarity: {post.polarity}</p>
                            <p style={{color: "#1975B5", fontWeight: "bold"}}>Score: {post.score}</p>
                            <p style={{color: "#1E80C1", fontWeight: "bold"}}>Nubmer of Comments: {post.num_comments}</p>
                            <p style={{color: "#3725A4", fontWeight: "bold"}}>Interactiveness Score: {post.interactiveness_score}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </div>

    </div>
  );
}

export default WordSearch;
