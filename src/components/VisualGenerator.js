import { useState } from 'react';
import './css/VisualGenerator.css';
import axios from 'axios';
import { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
function VisualGenerator() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSentiment, setSelectedSentiment] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [averageData, setAverageData] = useState('');
    const [imageSource, setImageSource] = useState('');
    const [graphData, setGraphData] = useState({
        labels: [],
        datasets: [
          {
            label: selectedSentiment,
            data: [],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      });

    const handleChangeCategory = (event) => {
      setSelectedCategory(event.target.value);
    };
    
    const handleChangeSentiment = (event) => {
        setSelectedSentiment(event.target.value);
    };

    const handleChangeTime = (event) => {
        setSelectedTime(event.target.value);
    };

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const submitHandler = () =>{
        const data = { category: selectedCategory,
                       insight: selectedSentiment,
                       time_period: selectedTime,
                    }
        // Replace the URL with the endpoint of your Django server
        //This api is to get posts data
        axios.post('http://localhost:8080/polls/average/', data)
            .then(response => {
                //console.log("Response from server: ", response.data);
                // Handle the response data as needed
                setAverageData(response.data.result);
                //console.log(averageData);
            })
            .catch(error => {
                console.error("Error making the post request:", error);
                // Handle the error case as needed
            });

        let basePath = '';
        if( selectedCategory === "'Funny/Humor'"){
            if(selectedTime === "'2023-10-01' AND '2023-10-31'")  basePath = 'images/Funny_Humor_oct.png'  
            else if(selectedTime === "'2023-09-01' AND '2023-09-30'") basePath = 'images/Funny_Humor_sept.png' 
        } else if( selectedCategory === "'Learning and Education'"){
            if(selectedTime === "'2023-10-01' AND '2023-10-31'")  basePath = 'images/LAE_oct.png'  
            else if(selectedTime === "'2023-09-01' AND '2023-09-30'") basePath = 'images/LAE_sept.png' 
        } else if( selectedCategory === "'Internet Culture and Memes'"){
            if(selectedTime === "'2023-10-01' AND '2023-10-31'")  basePath = 'images/ICM_oct.png'  
            else if(selectedTime === "'2023-09-01' AND '2023-09-30'") basePath = 'images/ICM_sept.png'  
        }   else if(selectedCategory === "'Technology'"){
            if(selectedTime === "'2023-10-01' AND '2023-10-31'")  basePath = 'images/tech_oct.png'  
            else if(selectedTime === "'2023-09-01' AND '2023-09-30'") basePath = 'images/tech_sept.png' 
        }   else if(selectedCategory === "'World News'"){
            if(selectedTime === "'2023-10-01' AND '2023-10-31'")  basePath = 'images/world_news_oct.png'  
            else if(selectedTime === "'2023-09-01' AND '2023-09-30'") basePath = 'images/world_news_oct.png' 
        }   

        setImageSource(basePath);

        axios.post('http://localhost:8080/polls/graph/', data)
          .then(response => {
              // Extract data for chart
              console.log(response.data)
              const chartLabels = response.data.result.map(d => d.date);
              const chartData = response.data.result.map(d => d[selectedSentiment.toLowerCase()]); // Use selectedSentiment to determine which property to plot

              // Set the state for graphData
              setGraphData({
                labels: chartLabels,
                datasets: [
                  {
                    label: selectedSentiment,
                    data: chartData,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                  }
                ]
              });
          })
            .catch(error => {
                console.error("Error making the post request:", error);
                // Handle the error case as needed
            });
    }
    
    
    return (
        <div className="VisualContainer">
            <div className='menus'>
                <div className="form-group">
                    <label htmlFor="category-select" className="custom-label">Category</label>
                    <select id="category-select" className="custom-select" value={selectedCategory} onChange={handleChangeCategory}>
                        <option value="">Select Category</option>
                        <option value="'Funny/Humor'">Funny/Humor</option>
                        <option value="'World News'">World News</option>
                        <option value="'Internet Culture and Memes'">Internet Culture and Memes</option>
                        <option value="'Learning and Education'">Learning and Education</option>
                        <option value="'Technology'">Technology</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label htmlFor="time-select" className="custom-label">Time Period</label>
                    <select id="time-select" className="custom-select" value={selectedTime} onChange={handleChangeTime}>
                        <option value="">Choose Time Period</option>
                        <option value="'2023-10-01' AND '2023-10-31'">October</option>
                        <option value="'2023-09-01' AND '2023-09-30'">September</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="insights-select" className="custom-label">Insight</label>
                    <select id="insight-select" className="custom-select" value={selectedSentiment} onChange={handleChangeSentiment}>
                        <option value="">Choose Insight</option>
                        <option value="Polarity">Polarity</option>
                        <option value="score">Score</option>
                        <option value="num_comments">Number of Comments</option>
                    </select>
                </div>
                <button onClick={submitHandler}> Generate Charts</button>
            </div>
            
            <div className='visuals'> 
                <div className="visualOne">
                {graphData.labels.length > 0 && (
                      <div className="chart-container">
                        <h2>Graph for {capitalizeFirstLetter(selectedCategory.replace(/'/g, ""))}</h2>
                        <Line data={graphData} />
                      </div>
                    )}
                </div>

                
                <div className="visualTwo">
                {averageData.length > 0 && averageData.map((dataItem, index) => (
                        <div className="averages" key={index}> 
                            <p>Average Polarity: {parseFloat(dataItem.polarity).toFixed(3)}</p>
                            <p>Average Score: {parseFloat(dataItem.score).toFixed(3)}</p>
                            <p>Average # of Comments: {parseFloat(dataItem.comments).toFixed(0)}</p>
                        </div>
                ))}
                { averageData.length > 0 && <h2>Word Cloud for Category '{capitalizeFirstLetter(selectedCategory)}'</h2>}
                { imageSource && <img src={imageSource} alt="Dynamic Content"  style={{ maxWidth: '75%', height: 'auto' }} />}
                </div>
            </div>


        </div>  
    );
}

export default VisualGenerator;
