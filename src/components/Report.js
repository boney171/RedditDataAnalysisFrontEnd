import './css/Report.css';
import ReportImage1 from './images/DTVST.png'; 
import ReportImage2 from './images/ETVST.png'; 

function Report() {
  return (
  <div className='reportContainer'>
    <div className='report'>
        <img src={ReportImage1} alt="Report 1 Image"/>
    </div>
    <div className='report'>
        <img src={ReportImage2} alt="Report 2 Image"/>
    </div>
  </div>
  
  );
}

export default Report;
