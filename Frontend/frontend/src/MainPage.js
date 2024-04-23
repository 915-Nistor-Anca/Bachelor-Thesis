import { Link } from 'react-router-dom';

function MainPage() {
  return (
    <div>
      <h1>Main Page</h1>
      <div>
          <Link to="/observationspage">Observations</Link>
        </div>
    </div>
    
  );
}

export default MainPage;
