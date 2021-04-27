import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';


export default function(SpecificComponent, option, adminRoute = null) {

    function AuthenticationCheck(props) {

        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response => {
                
                // 로그인 하지 않은 상태
                if(!response.payload.isAuth) {
                    if(option){
                        alert("로그인 후 이용 가능한 페이지입니다.");
                        props.history.push('/login');
                    }
                }
                else { // 로그인한 상태
                    if(adminRoute && !response.payload.isAdmin){
                        alert("관리자만 사용 가능한 페이지입니다.");
                        props.history.push('/');
                    }
                    else{
                        if(option === false){
                            props.history.push('/');
                        }
                    }
                }
            });
        }, []);

        return (
            <SpecificComponent />
        );
    }

    return AuthenticationCheck;
}

// option: null => 아무나 출입가능
//         true => 로그인한 유저만 출입 가능
//         false => 로그인한 유저는 출입 불가

// adminRoute: true => admin user만 출입 가능하게 하고 싶을 때