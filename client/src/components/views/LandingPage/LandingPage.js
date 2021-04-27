import React, {useEffect} from 'react';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

function LandingPage(props) {
    
    useEffect(() => {
        axios.get('/api/hello').then(response => console.log(response.data));
    }, []);

    const onClickHandler = () => {
        axios.get('/api/users/logout')
            .then(response => {
                if(response.data.success) props.history.push('/login');
                else alert("Failed to logout");
            });
    }
    
    
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
            
            <Button color="primary" onClick={onClickHandler}>로그아웃</Button>

        </div>
    );
}

export default withRouter(LandingPage);
