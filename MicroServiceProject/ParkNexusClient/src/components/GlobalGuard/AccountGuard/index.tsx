import {useEffect} from 'react';
import {LoadingScreen} from '../LoadingScreen';
import {useAuthStore} from '@src/states';
import {useData} from './index.data';

interface IAccountGuardProps {
    children: React.ReactNode;
}

export function AccountGuard({children}: IAccountGuardProps) {
    const {isFetching, data} = useData();
    const {setIsAuthenticated} = useAuthStore();

    useEffect(() => {
        if (data?.isAuthenticated === true) setIsAuthenticated(true);
    }, [data, setIsAuthenticated]);

    if (isFetching) return <LoadingScreen />;
    return children;
}
